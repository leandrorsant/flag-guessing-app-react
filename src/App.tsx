import React from 'react';
import logo from './logo.svg';
import Flag from 'react-world-flags'
import { useState, useEffect, useRef, createRef } from 'react';
import { AppShell, Box, Burger, Button, Center, Text, Modal, TextInput } from '@mantine/core';

import AppMain from './components/AppMain';
import { useDisclosure } from '@mantine/hooks';
import Highscores from './components/Highscores';


function App() {
  const [opened, { toggle }] = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const API_URL = "http://127.0.0.1:5000/users/name/"
  const fetchUser =  async (name:string) => {
    await fetch(API_URL + name)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }

      return response.json()})
    .then((data)=> {
      setCurrentUser(data[0])
    }) 
    .catch((error)=> {});
  }

  const handleAccountCreation = async () => {
    const requestBody = {
      name : username,
      password: password,
      highscore: 0
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
  }
  try{
    const response = await fetch(
      "http://127.0.0.1:5000/users/",requestOptions).then( (response) => {
      if(response.status == 201){
        alert("Account Created")
      }
        else{
        throw new Error(
          "Username is already taken"
        );
        }
        return response.json()
      } ).then ( (data) => {
        setCurrentUser(data[0])
      })
    }catch(error : any){
      alert(error.message)
    }

  }

  const handleLogin = async () => {
    const requestBody = {
      name : username,
      password: password
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
  }
  try{
    const response = await fetch(
      "http://127.0.0.1:5000/users/login",requestOptions).then( (response) => {
      if(!response.ok)
        if(response.status == 404){
          alert("Incorrect username or password");
          setCurrentUser(null);
        }else{
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
        }
        return response.json()
      } ).then ( (data) => {
        setCurrentUser(data[0])
      })
    }catch(error : any){
      alert(error.message)
    }
  }

  const updateUser = (user : any) =>{
    setCurrentUser(user);
  }

  return (
    <>
     <AppShell
      header={{ height: 70 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header >
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        
        
        
        <Box style={{display:"flex", justifyContent: 'flex-end' }}>
        <Text style={{position:'absolute', top:0, left:0}} size="30px">{currentUser != null? "Hello, "+currentUser.name : ""}</Text>
        {currentUser == null?<>
          <TextInput value={username} onChange={(input) => setUsername(input.currentTarget.value)} placeholder='username'></TextInput>
          <TextInput value={password} onChange={(input) => setPassword(input.currentTarget.value)} placeholder='password'></TextInput>
          
          <Button onClick={ async ()=>{ 
            handleLogin();
            }}>Login</Button>
            <Button onClick={ async ()=>{ 
              handleAccountCreation()
            }}>Create Account</Button>
            </>
            :<Button onClick={()=>{ 
              setCurrentUser(null)
              }}>Logout</Button>
          }
        </Box>
        
        
        
      </AppShell.Header>

      <AppShell.Navbar p="md"><Highscores user={currentUser} setUser={setCurrentUser}/></AppShell.Navbar>
      <AppShell.Main><AppMain user={currentUser} gameOver={gameOver} setGameOver={setGameOver}/></AppShell.Main>
      <AppShell.Aside></AppShell.Aside>
    </AppShell>
    </>
  );
}

export default App;
