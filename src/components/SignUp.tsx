import { TextInput,Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import React, { useState } from 'react'
import { API_IP } from './Constants'

import { sha256 } from './sha256'

const SignUp = ({setCurrentUser} :any ) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");


  const handleAccountCreation = async () => {
    const requestBody = {
      name : username,
      password: sha256(password),
      highscore: 0
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
  }
  try{
    const response = await fetch(
      "http://"+API_IP+"/users/",requestOptions).then( (response) => {
      if(response.status == 201){
        modals.open({
          title: 'Account created',
          children: (
            <>
              <Text>You can now sign in to your newly created account to save your highscores.</Text>
            </>
          ),
        });
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
      modals.open({
        title:'Unable to create account',
        styles:{
          title:{color:"red"}
        },
        children: (
          <>
            <Text>{error.message}</Text>
          </>
        ),
      });
      
    }

  }


  return (<>
    <TextInput label="Your username:" placeholder="username" value={username} onChange={(input) => setUsername(input.target.value) } data-autofocus></TextInput>
          <TextInput type="password" label="Your password:" placeholder="password" value={password} onChange={(input) => setPassword(input.currentTarget.value)}></TextInput>
          
          <Button fullWidth onClick={ async ()=>{ 
            
            handleAccountCreation()
            modals.closeAll()
            }} mt="md">Create Account</Button>
    </>
  )
}

export default SignUp