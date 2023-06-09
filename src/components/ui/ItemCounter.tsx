import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  currentValue: number; 
  maxValue: number;
  updateQuantity: (value: number) => void; 
}

export const ItemCounter: FC<Props> = ({currentValue, maxValue, updateQuantity}) => {

  const addOrRemove = (value: number) =>{    
    if ( value === -1 ) {
      if ( currentValue === 1 ) return;
      return updateQuantity( currentValue - 1);
    }
    if ( currentValue >= maxValue ) return;
    updateQuantity( currentValue + 1 );
  }

  return (
    <Box display={'flex'}
      alignItems={'center'}>
      <IconButton onClick={()=>addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
      <IconButton onClick={()=>addOrRemove(1)}>
        <AddCircleOutline/>
      </IconButton>
    </Box>
  )
}
