import React from 'react'
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef,GridRenderCellParams } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },
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

const rows = [
  { id: 1, paid: false, fullname: 'Daniel Calderón' },
  { id: 2, paid: false, fullname: 'Checo Perez' },
  { id: 3, paid: true, fullname: 'Julian Calderón' },
  { id: 4, paid: false, fullname: 'Mario Calderón' },
  { id: 5, paid: true, fullname: 'Victor Calderón' },
  { id: 6, paid: false, fullname: 'Mariana Calderón' },
]

const HistoryPage = () => {
  return (
    <ShopLayout
      title='Historial de ordenes'
      pageDescription='Historial de ordenes del cliente'
    >
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container>
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

export default HistoryPage