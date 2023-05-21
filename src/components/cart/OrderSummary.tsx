import { Grid, Typography } from '@mui/material'
import React from 'react'

export const OrderSummary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>3</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>{`$${153.35}`}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos (16%)</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>{`$${32.35}`}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant='subtitle1'>Total</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography variant='subtitle1'>{`$${185.70}`}</Typography>
      </Grid>
    </Grid>
  )
}
