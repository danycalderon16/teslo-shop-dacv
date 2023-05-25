import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';
import React from 'react'

const KidPage = () => {
  const { products, isLoading, isError } = useProducts('/products?gender=kid');
  return (
    <ShopLayout title='Niños' pageDescription='Productos para niños'>
      <Typography variant="h1" component={"h1"}>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Todos los para niño</Typography>
      {
        isLoading ? <FullScreenLoading />
          :
          <ProductList products={products} />
      }
    </ShopLayout>
  )
}

export default KidPage