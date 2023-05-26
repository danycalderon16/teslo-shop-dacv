import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interfaces';

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
}

interface Props {
  children: React.ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);


  useEffect(()=>{
    try {
      
      const cookiesProducts = Cookie.get('cart') 
      ? JSON.parse(Cookie.get('cart')!) : []
      // console.log(JSON.parse(Cookie.get('cart')));
      dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:cookiesProducts})
    } catch (error) {
      dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:[]})
      
    }
  },[])

  useEffect(() => {
    Cookie.set('cart',JSON.stringify(state.cart));     
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    const extistProductInCart = (state.cart.find(item => item._id === product._id))?.size === product.size;

    const newCart = extistProductInCart ? state.cart.map(item => {
      if (item._id === product._id && item.size === product.size) {
        return { ...item, quantity: item.quantity + product.quantity }
      }
      return item
      }
    ): [...state.cart, product];

    dispatch({ type: '[Cart] - Update Cart', payload: newCart })
  }

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart
    }}>
      {children}
    </CartContext.Provider>
  )
};