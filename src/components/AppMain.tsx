import Flag from 'react-world-flags'
import { useState, useEffect } from 'react';
import { Box, Center, Title } from '@mantine/core';
import { Button } from '@mantine/core';
import { IconCheckbox }  from '@tabler/icons-react';
import { COUNTRY_DATA } from './country_data';
import styles from './styles'
import RemainingTries from './RemainingTries';
import GameOver from './GameOver';
import { API_IP } from './Constants';

const getRandomArbitrary = (min: number, max: number) => {
  return Math.trunc(Math.random() * (max - min) + min);
}

const getRandomCountry = () => {
  const country = getRandomArbitrary(0,COUNTRY_DATA.length-1);
  return COUNTRY_DATA[country];
}


function AppMain({user, setUser, gameOver, setGameOver}:any) {
  const [country, setCountry] = useState(getRandomCountry());
  const [correct, setCorrect] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [remainingTries, setRemainingTries] = useState(5);

  const updateUserHighscore = async (score: any)=>{
    if(user == null)
      return;

    const requestBody = {
      _id  : user._id,
      name : user.name,
      password: user.password,
      highscore: score
    }
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
  }
  try{
    await fetch(
      "http://"+API_IP+"/users/"+user._id,requestOptions).then( (response) => {
      if(response.ok){

      }
      else{
        throw new Error(
          "Error updating highscore"
        );
      }})
    }catch(error : any){
      alert(error.message)
    }
  }

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
      setUser(data[0])
    }) 
    .catch((error)=> {});
  }

  useEffect(()=>{
    if(user == null){
      setRemainingTries(5);
    }
  }, [user])

  useEffect(()=> {
    if(remainingTries <= 0){
      setGameOver(true);
      
    setBtnStyle(answerList.map(()=> styles.btnDefault));
    setRemainingTries(5);
    setCorrect(0);
    }
  }, [remainingTries]);

  useEffect(() => {
    setIsClient(true);
    if(user != null){
      fetchUser(user.name);
    }
  }, []);

  useEffect(()=>{
    const update = async ()=>{
      if(user != null){
        await fetchUser(user.name)
        if(correct > user.highscore){
          await updateUserHighscore(correct);
          await fetchUser(user.name)
        }
      }
    }
    update();
  },[correct]);

  useEffect(()=>{
    setAnswerlist(createList())
    setBtnStyle(answerList.map(()=> styles.btnDefault));
  },[country])
  
  
  const createList = () => {
    const listLength = 4;
    const correctAnswerIndex = getRandomArbitrary(0,listLength-1);
    let list = []
    for(let x=0;x<listLength;x++){
      if(x == correctAnswerIndex){
        list.push(country)
      }else{
        let randomCountry = country;
        while(randomCountry.numeric == country.numeric){
          randomCountry = getRandomCountry(); 
        }
        list.push(randomCountry);
      }
    }
      return list;
  }
  const [answerList,setAnswerlist] = useState(createList());
  const [btnStyle,setBtnStyle] = useState(answerList.map(()=> styles.btnDefault));
  
  
  return (
    <>
    {gameOver && <GameOver currentUser={user} setCurrentUser={setUser} setGameOver={setGameOver}/>}
    {isClient && !gameOver && 
      <Center style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'}}>
        <Box>
            
            
            <Box style={{width:"300px", whiteSpace:'nowrap'}}>
            <Center>
            <Title style={{marginLeft:"3px"}} order={2}>{correct}<IconCheckbox color='green'/></Title>
            </Center>
                <RemainingTries count={remainingTries} total={5}/>
                
              </Box>
              <Center style={{width:"300px"}}>
                  <Flag style={{maxHeight:"200px"}} code={country.numeric} width="300px" />
              </Center>
                {answerList.map((data, index)=>(
                  <Center>
                  <Button
                    key={index} 
                    style={btnStyle[index]} 
                    value={data.numeric} 
                    onClick={(e)=>{
                    if(e.currentTarget.value == country.numeric){
                      setCountry(getRandomCountry());
                      setCorrect((prev) => prev+1);
                    }else{
                      setRemainingTries((prev) => prev-1)
                      btnStyle[index] = styles.btnWrong;
                    }
                  }}
                  fullWidth
                  >{data.name}</Button></Center>
                ))}

          </Box>
      </Center>
    }
    </>
  );
}

export default AppMain;
