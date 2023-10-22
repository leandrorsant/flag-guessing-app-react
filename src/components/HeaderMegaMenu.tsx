import cx from 'clsx';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconLogout,
} from '@tabler/icons-react';
import {
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Anchor,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    useMantineTheme,
    Menu,
    Avatar
  } from '@mantine/core';
  import { IconFlag } from '@tabler/icons-react';
  import { useDisclosure } from '@mantine/hooks';
  import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
  } from '@tabler/icons-react';
  import classes from './HeaderMegaMenu.module.css';
import Highscores from './Highscores';
import { useState } from 'react';
  
  const mockdata = [
    {
      icon: IconCode,
      title: 'Open source',
      description: 'This Pokémon’s cry is very loud and distracting',
    },
    {
      icon: IconCoin,
      title: 'Free for everyone',
      description: 'The fluid of Smeargle’s tail secretions changes',
    },
    {
      icon: IconBook,
      title: 'Documentation',
      description: 'Yanma is capable of seeing 360 degrees without',
    },
    {
      icon: IconFingerprint,
      title: 'Security',
      description: 'The shell’s rounded shape and the grooves on its.',
    },
    {
      icon: IconChartPie3,
      title: 'Analytics',
      description: 'This Pokémon uses its flying ability to quickly chase',
    },
    {
      icon: IconNotification,
      title: 'Notifications',
      description: 'Combusken battles with the intensely hot flames it spews',
    },
  ];
  
 

  export function HeaderMegaMenu({currentUser, setCurrentUser, signInModal, signUpModal}: any) {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const theme = useMantineTheme();


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
            <Menu.Item onClick={() => setCurrentUser(null)} leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
              Log out
            </Menu.Item>
      
    
            
          </Menu.Dropdown>
        </Menu>
      );
    }
  
    const links = mockdata.map((item) => (
      <UnstyledButton className={classes.subLink} key={item.title}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    ));
  
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
            {/* <Text>Hello, {currentUser.name}</Text> */}
            {userDropdown()}
            {/* <Button onClick={() => setCurrentUser(null)}>Log out</Button> */}
            </>}
            </Group>
  
            <Box display={"flex"} hiddenFrom='sm'>{currentUser != null? userDropdown() : <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" /> }
            {/* <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" /> */}
            
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