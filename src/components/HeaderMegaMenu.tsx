import cx from 'clsx';
import {
  Icon3dCubeSphere,
  IconFlag,
  IconFlagBolt,
  IconFlagCog,
  IconLogout, IconRefresh,
} from '@tabler/icons-react';
import {
    Group,
    Button,
    UnstyledButton,
    Text,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
    Menu,
    Avatar
  } from '@mantine/core';
  import { useDisclosure } from '@mantine/hooks';
  import {
    IconChevronDown,
  } from '@tabler/icons-react';
  import classes from './HeaderMegaMenu.module.css';
import Highscores from './Highscores';
import { useState } from 'react';
import { API_IP } from './Constants';
import { modals } from '@mantine/modals';
import { IconFlagCheck } from '@tabler/icons-react';



const resetHighscore = async (user: any) => { 
    if(user == null){  
      return;
    }
    const requestBody = {
      _id  : user._id,
      password: user.password,
      highscore: 0
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

const openResetHighscoresModal = (user : any) : any =>  {
    return modals.openConfirmModal({
      title: 'Highscore Reset',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to reset your highscore? This action is irreversible, and will set your current highscore to 0.
        </Text>
      ),
      labels: { confirm: 'Reset highscore', cancel: "No, don't reset it" },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: () => resetHighscore(user),
    });
  }
  export function HeaderMegaMenu({currentUser, setCurrentUser, signInModal, signUpModal}: any) {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    function userDropdown() {
      return (
        <Menu shadow="md" width={200}>
          <Menu.Target>
          <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                  <Group gap={7}>
                    <Avatar src={"https://toppng.com/public/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png"} alt={currentUser.name} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {currentUser.name}
                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
          </Menu.Target>
    
          <Menu.Dropdown>
            <Menu.Label>Hello {currentUser.name}</Menu.Label>
            <Menu.Item onClick={() => {
                openResetHighscoresModal(currentUser)}} leftSection={<IconRefresh style={{ width: rem(14), height: rem(14) }} />}>
              Reset your highscore
            </Menu.Item >

            <Menu.Item 
              onClick={() => {
                  setCurrentUser(null)
                  localStorage.removeItem('session_id');
              } } leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    }
  
   
  
    return (
      <Box pb={120}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Text></Text>
  
            <Group visibleFrom="sm">
             {currentUser == null?
             <>
              <Button variant='default' onClick={ async ()=>{ 
                signInModal()
                }}>Sign in</Button>

              <Button  onClick={ async ()=>{ 
                signUpModal()
                }}
                >Sign up</Button>
            </>
            :<>
            {userDropdown()}
            </>}
            </Group>
  
            <Box display={"flex"} hiddenFrom='sm'>{currentUser != null? userDropdown() : <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" /> }
            </Box>
          </Group>
        </header>
  
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title=""
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />
  
            <Center><Highscores user={currentUser} setUser={setCurrentUser} width={400}/></Center>
  
            <Divider my="sm" />
  
            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default" onClick={async()=>{
                signInModal()
                closeDrawer()
              }}>Sign in</Button>
              <Button onClick={async ()=>{
                signUpModal()
                closeDrawer()
            }}>Sign up</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
    );
  }