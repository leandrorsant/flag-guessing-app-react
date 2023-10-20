import React from 'react'
import { IconHeartFilled, IconHeart, IconHeartBroken } from '@tabler/icons-react'
type Props = {}




const RemainingTries = ({count, total} : any) => {

  return (
    <div>
        {Array.from(new Array(total)).map((_, i) => (
             i<count? <IconHeartFilled/> : <IconHeartBroken/>
        ))}
        </div>
  )
}

export default RemainingTries