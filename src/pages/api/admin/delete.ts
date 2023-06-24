import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order, Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      console.log('dentro');
      return deleteOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.log('22');
  
  const { _id = '' } = req.body as IOrder;

  
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El _id de la orden no es válido' });
  }

  await db.connect();
  const order = await Order.deleteOne({_id});
  console.log(order);
  
  await db.connect();
  
  if (!order) {
    return res.status(400).json({ message: 'La orden no existe ' });
  }

  return res.status(200).json({ message: 'Orden eliminada' });
}
