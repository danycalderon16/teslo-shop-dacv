import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie';

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context';
import { countries } from '@/utils';

const SummaryPage = () => {

  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
  const router = useRouter();

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if(!Cookies.get('firstName')){
      router.push('/checkout/address');
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const {hasError, message} = await createOrder();
    if(hasError){
      setIsPosting(true);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);

  }


  if (!shippingAddress) {
    return <></>
  }

  const { 
    lastName,
    firstName,
    address,
    address2,
    city,
    zip,
    country,
    phone } = shippingAddress;

  const nameCountry = countries.find(coun => coun.code === country)?.name;

  return (
    <ShopLayout
      title='Resumen de la orden'
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component={'h1'}>Carrito</Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList editable={false} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>{`Resumen (${numberOfItems} ${numberOfItems === 1 ? 'productos' : 'productos'})`}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <Link component={NextLink}
                  href='/checkout/address'
                  passHref
                  underline='always'>
                  Editar
                </Link>
              </Box>

              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>{`${address} ${address2 ? address2 : ''} `}</Typography>
              <Typography>{`${city},  ${zip}`}</Typography>
              {/* <Typography>{`${nameCountry}`}</Typography> */}
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent={'end'}>
                <Link component={NextLink}
                  href='/cart'
                  passHref
                  underline='always'>
                  Editar
                </Link>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display={'flex'} flexDirection={'column'}>
                <Button 
                color='secondary' 
                className='circular-btn' 
                fullWidth
                onClick={onCreateOrder}
                disabled={isPosting}>
                  Confirmar Orden
                </Button>
                <Chip 
                 color='error'
                 label={errorMessage}
                 sx={{display:errorMessage?'flex':'none', mt:2}}></Chip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage