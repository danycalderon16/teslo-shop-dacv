import { IProduct } from '@/interfaces'
import { Box, Card, CardActions, CardMedia, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import React, { FC, useMemo, useState } from 'react'

interface Props {
  product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)

  const productImage = useMemo(() => {
    return isHovered
      ? `products/${product.images[1]}`
      : `products/${product.images[0]}`
  }, [isHovered, product.images])

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <Link component={NextLink} href={`product/slug`} passHref prefetch={false}>
          <CardActions>
            <CardMedia
              component='img'
              className='fadeIn'
              image={productImage}
              alt={product.title}
            />
          </CardActions>
        </Link>
      </Card>
      <Box sx={{ ml: 1 }} className='fadeIn'>
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  )
}
