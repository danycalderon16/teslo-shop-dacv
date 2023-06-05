import { IOrder } from '@/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/database';
import { Product, Order } from '@/models';

type Data = {  message: string }
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);

    default:
      return res.status(200).json({ message: 'Bad request' })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const {orderItems, total} = req.body as IOrder;

  // Verificar qie tengamos un usuario

  const session: any = await getServerSession(req, res, authOptions);

  if(!session){
    return res.status(401).send({message: 'It must be authenticated'});
  }

  // Crear un arreglo con los productos que la person quiere 
  const productsIds = orderItems.map(product => product._id);

  await db.connect();
  const dbProducts = await Product.find({_id:{$in: productsIds}});
  
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      
      
      const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
      if(!currentPrice){
        throw new Error('Verifique el carrito de nuevo, producto no existe')
      }
      return currentPrice * current.quantity + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0.15)
    const backendTotal = subTotal * (taxRate + 1);

    if(total !== backendTotal){
      throw new Error('El total no cuadra con el monto')
    }

    // Todo bien a este punto
    const userId = session.user._id;
    const newOrder = new Order({...req.body, isPaid:false, user:userId});
    await newOrder.save();
    await db.disconnect()

    return res.status(200).json(newOrder)


  } catch (error:any) {
    await db.disconnect()
    console.log(error);
    res.status(400).json({message: error.message || 'Revise logs del servidor'});    
  }

  // return res.status(201).json(session);
}