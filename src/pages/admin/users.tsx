import React from 'react'
import { PeopleOutline } from '@mui/icons-material'
import { Chip, Grid, Link, MenuItem, Select, Typography } from '@mui/material'
import { AdminLayout } from '@/components/layouts'

import { DataGrid, GridColDef,GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { IUser } from '@/interfaces'
import { tesloApi } from '@/api'

const UseresPage = () => {

  const { data, error} = useSWR<IUser[]>('/api/admin/users');

  if(!data && !error) return <></>

  const onRoleUpdated = async (userId:string, newRole:string) => {
    try {
      await tesloApi.put('/admin/users', {userId, role:newRole});
    } catch (error) {
      alert('No se pudo actualizar el rol del usuario');
    }
  }

  const columns: GridColDef[] = [
    {field:'email',headerName:'Correo', width:250},
    {field:'name',headerName:'Nombre', width:300},
    {
      field:'role',
      headerName:'Role', 
      width:300,
      renderCell:({row}:GridRenderCellParams) => {
        return (
          <Select 
          value={row.role}
          onChange={({target}) => onRoleUpdated(row.id, target.value)}
          label="Rol"
          sx={{width:'300px'}}>
              <MenuItem value='admin'>admin</MenuItem>
              <MenuItem value='client'>Cliente</MenuItem>
              <MenuItem value='super-user'>Super-user</MenuItem>
              <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        )      
      }    
    }
  ];

  const rows = data!.map(user => ({
    id:user._id,
    email:user.email,
    name:user.name,
    role:user.role
  }))


  return (
    <AdminLayout
    title='Usuarios'
    subTitle='Mantenimiento de usuarios'
    icon={<PeopleOutline />}>
        <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UseresPage