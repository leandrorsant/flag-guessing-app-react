import Flag from 'react-world-flags'
import { useState, useEffect, useRef, createRef } from 'react';
import { Box, TextInput, Center, Alert, Title, BackgroundImage, Table, TableTr, TableTd } from '@mantine/core';
import { Button } from '@mantine/core';
import { Text } from '@mantine/core';
import { IconInfoCircle }  from '@tabler/icons-react';
import { COUNTRY_DATA } from './country_data';
import styles from './styles'
import RemainingTries from './RemainingTries';
import { modals } from '@mantine/modals';
import GameOver from './GameOver';
import { API_IP } from './Constants';

const getRandomArbitrary = (min: number, max: number) => {
  return Math.trunc(Math.random() * (max - min) + min);
}

const getRandomCountry = () => {
  const country = getRandomArbitrary(0,COUNTRY_DATA.length-1);
  return COUNTRY_DATA[country];
}

const openModal = () => modals.openConfirmModal({
  title: 'Please confirm your action',
  children: (
    <Text size="sm">
      This action is so important that you are required to confirm it with a modal. Please click
      one of these buttons to proceed.
    </Text>
  ),
  labels: { confirm: 'Confirm', cancel: 'Cancel' },
  onCancel: () => console.log('Cancel'),
  onConfirm: () => console.log('Confirmed'),
});


function AppMain({user, setUser, gameOver, setGameOver}:any) {
  const [country, setCountry] = useState(getRandomCountry());
  const [message,setMessage] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const icon = <IconInfoCircle />;  
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
    const response = await fetch(
      "http://"+API_IP+"/users/"+user._id,requestOptions).then( (response) => {
      if(response.ok){
        //alert("Highscore update")
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
  useEffect(()=>{
    if(user != null){
      setHighscore(user.highscore);
    }
    setRemainingTries(5);
  }, [user])

  useEffect(()=> {
    if(correct > highscore)
        setHighscore(correct);
    
    if(remainingTries <= 0){
      setGameOver(true);
      //alert("Game Over")
      //alert("highscore: "+highscore)
      
    setHighscore(correct);
    if(user != null){
        updateUserHighscore(highscore);
    }
    setRemainingTries(5);
    setCorrect(0);
    }
  }, [remainingTries]);

  useEffect(() => {
    setIsClient(true);
    //fetchSingleUser("6530056cba85c10d2bf90fa4")
  }, []);

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
  
  
  const handleMessage = (message : string)=>{
    if(message == 'Correct'){
      return <Alert variant="light" color="green" title="Correct" icon={icon}>
      Way to go!
    </Alert>
    }
    if(message == 'Wrong')
      return <Alert variant="light" color="red" title="Wrong" icon={icon}>
      That's not it...
    </Alert>
    return "";
  }
  
  return (
    <>
    {gameOver && <GameOver currentUser={user} setCurrentUser={setUser} setGameOver={setGameOver}/>}
    {isClient && !gameOver && 
    <Box><Box>
      <Center>
        <Title order={2}>Score: {correct}</Title>
      </Center>
      <Center>
      <Box style={{width:"300px"}}>
        <RemainingTries count={remainingTries} total={5}/>
      </Box>
      </Center>
      <Center >
        <Center maw={400}>
          <Flag style={{marginTop: "10px"}} code={country.numeric} width="300px" />
        </Center>
        
      </Center>
      <Center style={{margin: "10px 10px 0px 10px"}}>
        <Title order={2}>What country is this?</Title>
      </Center>
    
      <Box style={{marginTop:"10px"}}>
      
          {answerList.map((data, index)=>(
            <Center>
            <Button
              key={index} 
              style={btnStyle[index]} 
              value={data.numeric} 
              onClick={(e)=>{
               
              if(e.currentTarget.value == country.numeric){
                setMessage('Correct')
                setCountry(getRandomCountry());
                setCorrect((prev) => prev+1);
              }else{
                setMessage('Wrong')
                setIncorrect((prev) => prev+1);
                setRemainingTries((prev) => prev-1)
                btnStyle[index] = styles.btnWrong;
              }
            }}>{data.name}</Button></Center>
          ))}
          </Box>
        
        <Center>
          <Box>
            {/* <Box style={{width:"300px"}}>{handleMessage(message)}</Box> */}
          </Box>
        </Center>
        </Box>      
    </Box>
    }
    </>
  );
}

export default AppMain;
