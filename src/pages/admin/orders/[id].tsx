import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import AirplaneTicketOutlined from '@mui/icons-material/AirplaneTicketOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import CreditScoreOutlined  from '@mui/icons-material/CreditScoreOutlined';

import { CartList, OrderSummary } from '@/components/cart'
import { AdminLayout, ShopLayout } from '@/components/layouts'
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

interface Props {
  order: IOrder
}


const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, subTotal, total, tax } = order;
  const [isPaying, setisPaying] = useState(false);

  return (
    <AdminLayout
      title='Resumen de la orden'
      subTitle={`Resumen de la orden ${order._id}`}
      icon={<AirplaneTicketOutlined/>}
    >
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

                <Box flexDirection={'column'}
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
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
                  
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query;  // your fetch function here 

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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