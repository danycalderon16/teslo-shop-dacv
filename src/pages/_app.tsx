import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'

import { lightTheme } from '@/themes'
import { AuthProvider, CartProvider, UIProvider } from '@/context'

export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return <></>;
  }
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{"client-id":process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
        <SWRConfig
          value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}
        >
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
