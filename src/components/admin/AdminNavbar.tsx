import React, { useContext } from 'react'
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import { UiContext } from '@/context'

export const AdminNavbar = () => {

  const { toggleSideMenu } = useContext(UiContext);

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
      
        <Button onClick={toggleSideMenu}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
}
