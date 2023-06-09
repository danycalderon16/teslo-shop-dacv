import React from 'react'
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import RemoveShoppingCartOutlined from '@mui/icons-material/RemoveShoppingCartOutlined';
import { Box, Link, Typography } from '@mui/material';

const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vacio" pageDescription='No hay artículos en el carrito'>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"calc(100vh - 200px)"}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlined sx={{fontSize:100}}/>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>        
          <Typography>Su carrito esta vacio</Typography>
          <Link component={NextLink} href='/' passHref 
          typography="h4" color="secondary">Regresar</Link>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage;