import { Button, Center, Box, Text, Loader } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Highscores from './Highscores'

type Props = {}

const GameOver = ({currentUser=null, setCurrentUser=null, setGameOver}:any) => {
  


  return (
    <>
    
    <Center>
    <Center maw={400} h={400}>
        <Box>
        <Center><Box><Text style={{fontSize:"50px"}}>GAME OVER</Text></Box></Center>
        
        <Highscores user={currentUser} setUser={setCurrentUser}/>
        <Center><Button onClick={() =>setGameOver(false)} mt='md'>Try Again</Button></Center>
        </Box>
    </Center>
    </Center>
    </>
  )
}

export default GameOver