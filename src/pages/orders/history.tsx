import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';

import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef,GridRenderCellParams } from '@mui/x-data-grid'

import { ShopLayout } from '@/components/layouts'
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'fullname', headerName: 'Nombre completo', width: 250 },
  {
    field: 'paid', headerName: 'Pagada',
    description: 'Muestra informacion si esta pagada o no',
    width: 200,
    renderCell:(params:GridRenderCellParams) =>{
      return (
        params.row.paid 
          ?<Chip color='success' label='Pagada' variant='outlined'/>
          :<Chip color='error' label='Pagada' variant='outlined'/>
      )
    }
  },
  {
    field: 'orden', headerName: 'Ver Orden',
    description: 'Ir a detalles de la orden ',
    width: 200,
    sortable:false,
    renderCell:(params:GridRenderCellParams) =>{
      return (
        <Link component={NextLink} href={`/orders/${params.row.id}`} passHref 
        underline='always'>Ver orden</Link>
      )
    }
  },
]

// const rows = [
//   { id: 1, paid: false, fullname: 'Daniel Calderón' },
//   { id: 2, paid: false, fullname: 'Checo Perez' },
//   { id: 3, paid: true, fullname: 'Julian Calderón' },
//   { id: 4, paid: false, fullname: 'Mario Calderón' },
//   { id: 5, paid: true, fullname: 'Victor Calderón' },
//   { id: 6, paid: false, fullname: 'Mariana Calderón' },
// ]

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({orders}) => {
  
  const rows = orders.map((order) => {
    return {
      id: order._id,
      paid: order.isPaid,
      fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
    }
  });

  return (
    <ShopLayout
      title='Historial de ordenes'
      pageDescription='Historial de ordenes del cliente'
    >
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const session:any = await getSession({req})

  if(!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrderByUser(session.user._id);

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage