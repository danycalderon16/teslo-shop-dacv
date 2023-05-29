import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interfaces';

export interface CartState {
  isLoaded:boolean;
  cart: ICartProduct[];
  numberOfItems: number,
  subTotal: number,
  tax: number,
  total: number
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0
}

interface Props {
  children: React.ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(()=>{
    try {      
      const cookiesProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
      // console.log(JSON.parse(Cookie.get('cart')));
      dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:cookiesProducts})
    } catch (error) {
      dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:[]})
      
    }
  },[])

  useEffect(() => {
    Cookie.set('cart',JSON.stringify(state.cart));     
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current)=>current.quantity + prev,0)
    const subTotal = state.cart.reduce((prev, current)=>current.price*current.quantity + prev,0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ||0.15)
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal*taxRate,
      total: subTotal *(taxRate + 1)
    }
    dispatch({type: '[Cart] - Update order summary', payload: orderSummary})    
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    const existProductInCart = state.cart.find(item => item._id === product._id && item.size === product.size)
    const newCart = existProductInCart ? state.cart.map(item => {
      if (item._id === product._id && item.size === product.size) {
        return { ...item, quantity: item.quantity + product.quantity }
      }
      return item
      }
    ): [...state.cart, product];

    dispatch({ type: '[Cart] - Update products in Cart', payload: newCart })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change Cart Quantity',payload:product})
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in Cart',payload:product});
  }

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeCartProduct
    }}>
      {children}
    </CartContext.Provider>
  )
};