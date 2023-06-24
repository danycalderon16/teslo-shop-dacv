import React from 'react'
import useSWR from 'swr'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, MuiEvent } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined'

import { AdminLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interfaces'
import { tesloApi } from '@/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 200 },
  { field: 'total', headerName: 'Monto total', width: 200 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ?
        (<Chip variant='outlined' label='Pagada' color='success' />)
        : (<Chip variant='outlined' label='Pendiente' color='error' />)
    }
  },
  { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 150 },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank'>
          Ver orden
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Creada en', width: 250 },
  {
    field: 'delete', headerName: 'Elimnar',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (<DeleteIcon />)
    },
  }
]

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
  if (!data && !error) return <></>

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }));

  return (
    <AdminLayout
      title='Ordenes'
      subTitle='Mantenimiento de ordenes'
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            onCellClick={async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
              if(params.field==='delete'){
                const id = params.id;
                const {data} = await tesloApi.post(`/admin/delete`,{_id:id});
                console.log({data});                
              }
            }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default OrdersPage