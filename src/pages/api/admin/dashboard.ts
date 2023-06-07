import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number; // role client
  numberOfProducts: number;
  productsWithNoInventory: number; // 0
  lowInventory: number; // productos con 10 o menos
}

export default async function handller(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect()

  // const numberOfOrders = await Order.find().count();
  // const paidOrders = await Order.find({'isPaid':true}).count();
  // const notPaidOrders = await Order.find({'isPaid':false}).count();
  // const numberOfClients = await User.find({'role': 'client'}).count();
  // const numberOfProducts = await Product.find().count();
  // const productsWithNoInventory = await Product.find({'inStock':0}).count();
  // const lowInventory = await Product.find({'inStock':{$lt:10}}).count();
  const [
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    Order.find().count(),
    Order.find({ 'isPaid': true }).count(),
    Order.find({ 'isPaid': false }).count(),
    User.find({ 'role': 'client' }).count(),
    Product.find().count(),
    Product.find({ 'inStock': 0 }).count(),
    Product.find({ 'inStock': { $lt: 10 } }).count(),
  ])

  await db.disconnect();
  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  })
}