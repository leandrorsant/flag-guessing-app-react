import { Button, Center, Box } from '@mantine/core'
import React from 'react'

type Props = {}

const GameOver = ({setGameOver}:any) => {
  return (
    <>
    <Center>
    <Center maw={400} h={400}>
        <Box>
        <Box>GAME OVER</Box>
        <Button onClick={() =>setGameOver(false)}>Try Again</Button>
        </Box>
    </Center>
    </Center>
    </>
  )
}

export default GameOver