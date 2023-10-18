import React from 'react';
import logo from './logo.svg';
import Flag from 'react-world-flags'
import { useState, useEffect, useRef, createRef } from 'react';
import { Box, TextInput, Center, Alert, Title, BackgroundImage } from '@mantine/core';
import { Button } from '@mantine/core';
import { Text } from '@mantine/core';
import { IconInfoCircle }  from '@tabler/icons-react';
import { COUNTRY_DATA } from './components/country_data';
import styles from './components/styles'
import './App.css';

const getRandomArbitrary = (min: number, max: number) => {
  return Math.trunc(Math.random() * (max - min) + min);
}

const getRandomCountry = () => {
  const country = getRandomArbitrary(0,COUNTRY_DATA.length-1);
  return COUNTRY_DATA[country];
}

function App() {
  const [country, setCountry] = useState(getRandomCountry());
  const [message,setMessage] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const icon = <IconInfoCircle />;  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    {isClient && 
    <Box><Box>
      <Center>
        <Title style={{marginTop:"50px"}} order={2}>Score: {correct}</Title>
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
                btnStyle[index] = styles.btnWrong;
              }
            }}>{data.name}</Button></Center>
          ))}
          </Box>
        
        <Center>
          <Box>
            <Box style={{width:"300px"}}>{handleMessage(message)}</Box>
          </Box>
        </Center>

        </Box>      
    </Box>
    }
    </>
  );
}

export default App;
