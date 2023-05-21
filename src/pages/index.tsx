import { ShopLayout } from "@/components/layouts";
import type { NextPage } from "next";
import { Typography } from "@mui/material";
import { initialData } from "@/database/products";
import { ProductList } from "@/components/products";

const Home: NextPage = () => {
  return (
    <ShopLayout
      title={"Teslo-Shop - Home"}
      pageDescription={"Encuentra los mejores diseños"}
    >
      <Typography variant="h1" component={"h1"}>Tienda</Typography>
      <Typography variant="h2" sx={{mb:1}}>Todos los productos</Typography>

      <ProductList products={initialData.products} />
    </ShopLayout>
  );
};

export default Home;