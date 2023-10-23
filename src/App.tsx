import { useState, useEffect } from 'react';
import { AppShell } from '@mantine/core';
import AppMain from './components/AppMain';
import { useDisclosure } from '@mantine/hooks';
import Highscores from './components/Highscores';
import { modals } from '@mantine/modals';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { API_IP } from './components/Constants';
import { HeaderMegaMenu } from './components/HeaderMegaMenu';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(()=>{
    const user = localStorage.getItem('user');
    if(user){
      setCurrentUser(JSON.parse(user));
      if(currentUser != null)
        fetchUser(currentUser.name);
    }
  },[])

  useEffect(()=>{
    if(currentUser == null)
      localStorage.removeItem('user');
    else {
      localStorage.setItem('user', JSON.stringify(currentUser))

    }
  },[currentUser])

  const API_URL = "http://"+API_IP+"/users/name/"
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

  const handleUsernameChange = (input: any) => {
    setUsername(prev => prev+input);
    alert(username);
  }

  const signUpModal = () =>{
    modals.open({
      title: 'Create your account',
      children: (
        <>
  
        <SignUp 
          setCurrentUser={setCurrentUser}
        />

        </>
      ),
    });
  }

  const signInModal = () => {
    
    modals.open({
      title: 'Sign in to your account',
      children: (
        <>
  
        <Login  
          setCurrentUser={setCurrentUser}
        />
  
         
        </>
      ),
    });
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
      "http://"+API_IP+"/users/",requestOptions).then( (response) => {
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
      "http://"+API_IP+"/users/login",requestOptions).then( (response) => {
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

  return (
    <>
    
     <AppShell
      header={{ height: 40 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header >
        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
        <HeaderMegaMenu 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
          signInModal={signInModal}
          signUpModal={signUpModal}
        />
        
        {/* <Box style={{display:"flex", justifyContent: 'flex-end' }}>
        <Box style={{display:"flex" ,position:'absolute', top:0, left:10}}><Text  size="20px" mt={'sm'} ml={'md'}><IconFlagSearch size={20}/>Flag Guessing</Text></Box>
        {currentUser == null?<>
          <Button size='sm' onClick={ async ()=>{ 
              signInModal()
            }} ml={'md'} mt={'md'}>Login</Button>
            <Button size='sm' onClick={ async ()=>{ 
              signUpModal()
            }} ml={'md'} mt={'md'} mr={'md'}>Sign up</Button>
            </>
            :<Box style={{display:"flex"}}>
              <Text size="30px" ml={'md'} mt={'md'}>{currentUser != null? "Hello, "+currentUser.name : ""}</Text>
              <Button onClick={()=>{ 
              setCurrentUser(null)
              }} ml={'md'} mt={'md'} mr={'md'}>Logout</Button>
              </Box>
          }
        </Box> */}
        
        
        
      </AppShell.Header>

      <AppShell.Navbar p="md"><Highscores user={currentUser} setUser={setCurrentUser}/></AppShell.Navbar>
      <AppShell.Main><AppMain user={currentUser} setUser={setCurrentUser} gameOver={gameOver} setGameOver={setGameOver}/></AppShell.Main>
      <AppShell.Aside></AppShell.Aside>
    </AppShell>
    </>
  );
}

export default App;
