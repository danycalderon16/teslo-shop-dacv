import { ICartProduct } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
  cart: ICartProduct[];

  // Methods
  addProductToCart: (product: ICartProduct) => void
}

export const CartContext = createContext({} as ContextProps);