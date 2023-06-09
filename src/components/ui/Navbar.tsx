import React, { useContext, useState } from 'react'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import ClearOutlined from '@mui/icons-material/ClearOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import { useRouter } from 'next/router'
import { CartContext, UiContext } from '@/context'

export const Navbar = () => {

  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const { asPath, push } = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  }
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

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
          className='fadeIn'>
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
        {
          isSearchVisible ? (
            <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={e => e.key === 'Enter' ? onSearchTerm() : null}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setIsSearchVisible(false)}>
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              className='fadeIn'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={() => setIsSearchVisible(true)}>
              <SearchOutlined />
            </IconButton>
          )
        }

        {/* Pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <Link component={NextLink} href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={numberOfItems>9? `+9`: numberOfItems } color='secondary'>
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
