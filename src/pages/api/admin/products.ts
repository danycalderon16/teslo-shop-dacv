import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database'
import { IProduct } from '@/interfaces'
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string }
  | IProduct[]
  | IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'POST':
      return crateProduct(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find()
    .sort({ title: 'asc' })
    .lean();

  // TODO: 
  // We will need to update the images
  await db.disconnect();
  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    });
    return product;
  });


  return res.status(200).json(updatedProducts);
}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del producto no es válido' });
  }
  if (images.length < 2) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
  }

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese id' });
    }
    //TODO: eliminar fotos en cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileid, extentision] = image
          .substring(image.lastIndexOf('/') + 1)
          .split('.');
        console.log({image, fileid, extentision});
        await cloudinary.uploader.destroy(fileid);
      }
    })

    await product.updateOne(req.body);
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }
}

const crateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
  }

  try {
    await db.connect();
    const productDB = await Product.findOne({ slug: req.body.slug })
    if (productDB) {
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
    }

    const product = new Product(req.body);
    await product.save();
    await db.disconnect();

    return res.status(201).json(product);

  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }

}

