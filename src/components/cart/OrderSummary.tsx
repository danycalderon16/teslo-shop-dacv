import { CartContext } from '@/context'
import { currency } from '@/utils'
import { Grid, Typography } from '@mui/material'
import React, { FC, useContext } from 'react'

interface Props {
  summaryItems?: {
    numberOfItems: number;
    subTotal: number;
    total: number;
    tax: number
  }
}


export const OrderSummary:FC<Props> = ({summaryItems}) => {
  const cart = useContext(CartContext);
  // const { numberOfItems, subTotal, total, tax } = useContext(CartContext);
  const { numberOfItems, subTotal, total, tax } = summaryItems ? summaryItems : cart;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>{numberOfItems} {numberOfItems > 1 ? 'prodcutos' : 'producto'}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography>{currency.format(tax)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant='subtitle1'>Total</Typography>
      </Grid>
      <Grid item xs={6} display={'flex'} justifyContent={'end'}>
        <Typography variant='subtitle1'>{currency.format(total)}</Typography>
      </Grid>
    </Grid>
  )
}
