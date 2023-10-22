
import { IconHeartFilled, IconHeartBroken } from '@tabler/icons-react'
import { Box } from '@mantine/core'





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