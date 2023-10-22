import React from 'react'
import { IconHeartFilled, IconHeart, IconHeartBroken } from '@tabler/icons-react'
import { Box, Center } from '@mantine/core'
type Props = {}




const RemainingTries = ({count, total} : any) => {
  return (
    <Box display='inline-block' style={{paddingBottom:"10px"}}>
        {Array.from(new Array(total)).map((_, i) => (
              i<count? <IconHeartFilled/> : <IconHeartBroken color='red'/>
        ))}
    </Box>
  )
}

export default RemainingTries