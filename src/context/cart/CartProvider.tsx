import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interfaces';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number,
  subTotal: number,
  tax: number,
  total: number

  shippingAddress?: ShippingAddress
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
}

interface Props {
  children: React.ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookiesProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
      // console.log(JSON.parse(Cookie.get('cart')));
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookiesProducts })
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })

    }
  }, [])

  useEffect(() => {
    if (Cookie.get('firstName')) {
      const shippingAddress: ShippingAddress = {
        firstName: Cookie.get('fisrtName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      }
      dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
    }
  }, [])

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
    const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0.15)
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    const existProductInCart = state.cart.find(item => item._id === product._id && item.size === product.size)
    const newCart = existProductInCart ? state.cart.map(item => {
      if (item._id === product._id && item.size === product.size) {
        return { ...item, quantity: item.quantity + product.quantity }
      }
      return item
    }
    ) : [...state.cart, product];

    dispatch({ type: '[Cart] - Update products in Cart', payload: newCart })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change Cart Quantity', payload: product })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in Cart', payload: product });
  }

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('fisrtName', address.firstName)
    Cookie.set('lastName', address.lastName)
    Cookie.set('address', address.address)
    Cookie.set('address2', address.address2 || '')
    Cookie.set('zip', address.zip)
    Cookie.set('city', address.city)
    Cookie.set('country', address.country)
    Cookie.set('phone', address.phone)
    dispatch({ type: '[Cart] - Update Address', payload: address});
  }

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeCartProduct,
      updateAddress,
    }}>
      {children}
    </CartContext.Provider>
  )
};