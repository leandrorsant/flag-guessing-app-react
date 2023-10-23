import { TextInput,Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useState } from 'react'
import { API_IP } from './Constants'

import { sha256 } from './sha256'

const Login = ({setCurrentUser} :any ) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const requestBody = {
      name : username,
      password: await sha256(password)
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
  }
  try{
    const response = await fetch(
      "http://"+API_IP+"/users/login",requestOptions).then( (response) => {
      if(!response.ok)
        if(response.status == 404){
          modals.open({
            title: 'Unable to sign in',
            styles:{
              title:{color:"red"}
            },
            children: (
              <>
                <Text>Incorrect username or password.</Text>
              </>
            ),
          });
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


  return (<>
    <TextInput label="Your username:" placeholder="username" value={username} onChange={(input) => setUsername(input.target.value) } data-autofocus></TextInput>
    <TextInput type="password" label="Your password:" placeholder="password" value={password} onChange={(input) => setPassword(input.currentTarget.value)}></TextInput>
          
          <Button fullWidth onClick={ async ()=>{ 
            handleLogin();
            modals.closeAll()
            }} mt="md">Sign in</Button>
    </>
  )
}

export default Login