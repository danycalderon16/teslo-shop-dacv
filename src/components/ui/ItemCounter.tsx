import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  currentValue: number; 
  maxValue: number;
  updateQuantity: (value: number) => void; 
}

export const ItemCounter: FC<Props> = ({currentValue, maxValue, updateQuantity}) => {

  const setNewValue = (value: number) =>{    
    if(currentValue+value === 0) {
      console.log("No puede ser 0");
      return;
    }
    if(currentValue+value >maxValue) {
      console.log("No hay tanto stock");
      return;
    }
    updateQuantity(value);
  }

  return (
    <Box display={'flex'}
      alignItems={'center'}>
      <IconButton onClick={()=>setNewValue(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
      <IconButton onClick={()=>setNewValue(1)}>
        <AddCircleOutline/>
      </IconButton>
    </Box>
  )
}
