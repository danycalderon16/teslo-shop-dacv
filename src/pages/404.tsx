import { ShopLayout } from "@/components/layouts";
import React from "react";
import { Box, Typography } from "@mui/material";

const Custom404 = () => {
  return (
    <ShopLayout
      title="Page Not Found"
      description={"No hay nada que mostrar aquí"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"calc(100vh - 200px)"}
        sx={{flexDirection:{xs:'column', sm:'row'}}}
      >
        <Typography
          variant="h1"
          component={"h1"}
          fontSize={80}
          fontWeight={200}
        >
          400 |
        </Typography>
        <Typography marginLeft={2}>
          No encontramos ninguna página aquí
        </Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
