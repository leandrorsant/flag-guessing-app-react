import { Center, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'

const API_URL = "http://127.0.0.1:5000/users"



const Highscores = ({user,setUser} : any) => {
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

  useEffect(()=>{
    fetchUsers()
    setUser(user); 
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers()
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Center><Title>Highscores</Title></Center>
    {isLoading && <div>loading highscores</div>}
      {
    users.map((data) => (
        <Center><Text>{data.name}: {data.highscore} </Text></Center>
    ) )}
    </>
  )
}

export default Highscores;