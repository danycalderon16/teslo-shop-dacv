import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { OrderResponseBody } from "@paypal/paypal-js"

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { tesloApi } from '@/api';

interface Props {
  order: IOrder
}


const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, subTotal, total, tax } = order;
  const router = useRouter();
  const [isPaying, setisPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en Paypal')
    }
    setisPaying(true);
    try {
      const { data } = await tesloApi.post('/orders/pays', {
        transactionId: details.id,
        orderId: order._id
      });

      router.reload()

    } catch (error) {
      setisPaying(false);
      console.log(error);
      alert('Error');
    }
  }

  return (
    <ShopLayout
      title='Resumen de la orden'
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component={'h1'}>Orden: {_id}</Typography>

      {isPaid ?
        <Chip
          sx={{ my: 2 }}
          label='Orden ya fue pagada'
          variant='outlined'
          color="success"
          icon={<CreditScoreOutlined />}
        /> :
        <Chip
          sx={{ my: 2 }}
          label='Pendiente de pago'
          variant='outlined'
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      }


      <Grid container className='fadeIn'>
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
              </Box>

              <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
              <Typography>{shippingAddress.address2} {shippingAddress.address2 ? `${shippingAddress.address2}` : ''}</Typography>
              <Typography>{shippingAddress.city}</Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary summaryItems={{ numberOfItems, subTotal, total, tax }} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection={'column'}>
                {/* TODO */}
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none' }}>
                  <CircularProgress />
                </Box>

                <Box
                  flexDirection={'column'}
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
                  {isPaid ?
                    <Chip
                      sx={{ my: 2 }}
                      label='Orden ya fue pagada'
                      variant='outlined'
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                    : (
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: `${order.total}`,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            onOrderCompleted(details)
                            // console.log(details);                            
                            // alert(`Transaction completed by ${name}`);
                          });
                        }}
                      />
                    )
                  }

                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query;  // your fetch function here 

  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage