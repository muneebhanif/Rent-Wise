import { Avatar, Box, Button, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Heart, LayoutGrid, MessageSquare, Settings, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import OwnerDash from '../DashboardComp.jsx/OwnerDash';
import UserDash from '../DashboardComp.jsx/UserDash';
import ReviewPage from '../DashboardComp.jsx/ReviewDash';
import FavouritesPage from '../DashboardComp.jsx/FavoruitesPage';
import { chatMediaUrl } from '../Conversation/chatMedia';

export default function Dashboard() {
  const { user } = useAuth();
  return <Box as="main" bg="#f6f7f9" minH="calc(100vh - 80px)" px={{ base: 4, md: 7 }} py={{ base: 6, md: 9 }} color="gray.800"><Box maxW="1240px" mx="auto">
    <Flex justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} mb={8} direction={{ base: 'column', md: 'row' }}><Flex gap={4} align="center"><Avatar name={user?.name} src={chatMediaUrl(user?.imageUrl)} bg="orange.100" color="orange.800" size={{ base: 'md', md: 'lg' }} /><Box><Text fontSize="10px" fontWeight="bold" color="gray.500" letterSpacing="1.7px" mb={1}>YOUR RENTWISE WORKSPACE</Text><Heading fontSize={{ base: '25px', md: '32px' }} letterSpacing="-1px">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</Heading><Text fontSize="sm" mt={1} color="gray.500">A clear view of every listing and every rental.</Text></Box></Flex><Flex gap={2}><Button as={Link} to="/chat" bg="white" borderWidth="1px" borderColor="gray.200" size="sm" leftIcon={<MessageSquare size={16} />}>Messages</Button><Button as={Link} to="/acc" bg="white" borderWidth="1px" borderColor="gray.200" size="sm" leftIcon={<Settings size={16} />}>Settings</Button></Flex></Flex>
    <Tabs colorScheme="teal" isLazy variant="unstyled"><TabList gap={1} bg="white" p={1.5} rounded="xl" borderWidth="1px" borderColor="gray.200" mb={7} overflowX="auto" w="fit-content" maxW="full">{[[LayoutGrid, 'Owner overview'], [ShoppingBag, 'My rentals'], [Star, 'Reviews'], [Heart, 'Favourites']].map(([Icon, label]) => <Tab key={label} flexShrink={0} gap={2} rounded="lg" fontSize="sm" fontWeight="semibold" px={{ base: 3, md: 5 }} py={2.5} color="gray.500" _selected={{ bg: '#edf5f2', color: '#24594b' }}><Icon size={16} />{label}</Tab>)}</TabList><TabPanels><TabPanel p={0}><OwnerDash /></TabPanel><TabPanel p={0}><UserDash /></TabPanel><TabPanel p={0}><ReviewPage /></TabPanel><TabPanel p={0}><FavouritesPage /></TabPanel></TabPanels></Tabs>
  </Box></Box>;
}
