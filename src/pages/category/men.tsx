
import type { NextPage } from "next";
import { ShopLayout } from "@/components/layouts";
import { useProducts } from "@/hooks";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { Typography } from "@mui/material";


const MenPage = () => {
  const { products, isLoading, isError } = useProducts('/products?gender=men');
  return (
  <ShopLayout title="hombres" pageDescription="Productos para hombres">
    <Typography variant="h1" component={"h1"}>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Todos los para hombre</Typography>

      {
        isLoading ?<FullScreenLoading/>
        :
        <ProductList products={products} />
      }
  </ShopLayout>
  )
}

export default MenPage;