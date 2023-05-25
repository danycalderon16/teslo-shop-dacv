import React, { useContext } from 'react'
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { UiContext } from '@/context'

export const Navbar = () => {

  const {toggleSideMenu} = useContext(UiContext);

  const { asPath } = useRouter();
  return (
    <AppBar>
      <Toolbar>
        <Link
          href='/'
          component={NextLink}
          underline='none'
          display={'flex'}
          alignItems={'center'}
          passHref
        >
          <Typography variant='h6'>Tesla |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex={1} />

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Link component={NextLink} href='/category/men' passHref>
            <Button
              color={asPath === '/category/men' ? 'primary' : 'info'}
            >Hombres</Button>
          </Link>
          <Link component={NextLink} href='/category/women' passHref>
            <Button
              color={asPath === '/category/women' ? 'primary' : 'info'}
            >Muejeres</Button>
          </Link>
          <Link component={NextLink} href='/category/kid' passHref>
            <Button
              color={asPath === '/category/kid' ? 'primary' : 'info'}
            >Niños</Button>
          </Link>
        </Box>

        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>

        <Link component={NextLink} href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={2} color='secondary'>
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>
        <Button onClick={toggleSideMenu}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
}
