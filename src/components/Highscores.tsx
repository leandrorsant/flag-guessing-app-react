import { Box, Center, Loader, Table, TableTd, TableTr, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { API_IP } from './Constants'
import { IconFlag } from '@tabler/icons-react'
const API_URL = "http://"+API_IP+"/users"



const Highscores = ({user,setUser, width=300} : any) => {
    //alert(JSON.stringify(user));
    const [users, setUsers] = useState<any []>([])
    const [isLoading, setIsLoading] = useState(true);
   

    const fetchUsers =  async () => {
        await fetch(API_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
    
          return response.json()})
        .then((data)=> {
          setUsers(data)
        }) 
        .catch((error)=> {});
      } 

  useEffect(()=>{
    fetchUsers() 
    setIsLoading(false);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers()
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    {isLoading && <Loader/>}
    <Box style={{width:width}}>
    <Center><Title order={3}>Highscores </Title></Center>
    
    <Table style={{width: width}}>
      { 
        
    users.map((data) => (
        
        
    <TableTr>
      {user != null && user.name == data.name?
      <><TableTd style={{color:"green", backgroundColor:"lightgreen"}}>{data.name}:</TableTd><TableTd style={{color:"green", textAlign:"right", backgroundColor:"lightgreen"}}>{data.highscore}</TableTd></> :
      <><TableTd>{data.name}:</TableTd><TableTd style={{textAlign:"right"}}>{data.highscore}</TableTd></>}
    </TableTr>  
        
  
        
        
    ) )}
    </Table>
    </Box>
    </>
  )
}

export default Highscores;