import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid,Link, Typography } from '@mui/material'
import React from 'react'
import NextLink from 'next/link';

const SummaryPage = () => {
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
              <Typography variant='h2'>Resumen (3 productos)</Typography>
              
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

              <Typography>Daniel Calderón</Typography>
              <Typography>Caoba #1121</Typography>
              <Typography>Tepic, Nayarit</Typography>
              <Typography>México</Typography>
              <Typography>+523111590913</Typography>

              <Divider sx={{my:1}}/>

              <Box display={'flex'} justifyContent={'end'}>
                <Link component={NextLink} 
                  href='/cart' 
                  passHref
                  underline='always'>
                    Editar
                </Link>
              </Box>

              <OrderSummary />
              
              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage