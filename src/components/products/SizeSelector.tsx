import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';
import React, {FC} from 'react'

interface Props {
  selectedSize?:ISize;
  sizes:ISize[];
}

export const SizeSelector:FC<Props> = ({selectedSize, sizes}) => {
  console.log(selectedSize, sizes);
  
  return (
    <Box>
      {
        sizes.map(size =>(
          <Button
            key={size}
            size={'small'}
            color={selectedSize===size ? 'primary': 'info'}>
              {size}
          </Button>
        ))
      }
    </Box>
  )
}