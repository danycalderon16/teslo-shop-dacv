import { FC, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext, authReducer } from './'
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

interface Props {
  children: React.ReactNode
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();

  const { data, status} = useSession()
  const session = useSession()

  useEffect(() => {
    
    if(status === 'authenticated'){      
      dispatch({type:'[Auth] - Login', payload: data?.user as IUser})
    }
  }, [status,data])

  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {
    if(!Cookies.get('token')){
      return;
    }
    try {
      // llamar al endpont
      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user} = data
      // Revalidar token guradando el nuevo
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });      
    } catch (error) {
      Cookies.remove('token');
    }


    // Mal

    // Borrar el token de las cookies
  }

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  }

  const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario, intente de nuevo.'
      }
    }
  }

  const logout = () => {
    Cookies.remove('cart');
    
    Cookies.remove('firstName')
    Cookies.remove('lastName')
    Cookies.remove('address')
    Cookies.remove('address2')
    Cookies.remove('zip')
    Cookies.remove('city')
    Cookies.remove('country')
    Cookies.remove('phone')
    
    // Cookies.remove('token');
    // router.reload();
    signOut();
  }

  return (
    <AuthContext.Provider value={{
      ...state,

      // Methods
      loginUser,
      registerUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
};