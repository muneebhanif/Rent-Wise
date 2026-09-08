import { Avatar, Flex, IconButton, Spacer, Tooltip } from '@chakra-ui/react';
import { Home, LayoutDashboard, MessageSquare, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { chatMediaUrl } from './chatMedia';

export default function SideBar() {
  const { user } = useAuth();
  return (
    <Flex as="nav" aria-label="Main navigation" direction="column" align="center" gap={3} w="76px" py={5} bg="#142c2b" flexShrink={0} display={{ base: 'none', md: 'flex' }}>
      <Tooltip label="RentWise home" placement="right"><IconButton as={Link} to="/" aria-label="RentWise home" icon={<Home size={22} />} color="white" bg="whiteAlpha.200" mb={5} _hover={{ bg: 'whiteAlpha.300' }} /></Tooltip>
      {[{ to: '/chat', label: 'Messages', icon: MessageSquare }, { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/media', label: 'New listing', icon: Plus }].map(({ to, label, icon: Icon }) => (
        <Tooltip key={to} label={label} placement="right"><IconButton as={Link} to={to} aria-label={label} icon={<Icon size={21} />} bg={to === '/chat' ? 'orange.400' : 'transparent'} color={to === '/chat' ? '#142c2b' : 'whiteAlpha.800'} _hover={{ bg: 'whiteAlpha.300' }} /></Tooltip>
      ))}
      <Spacer />
      <Tooltip label="Account settings" placement="right"><IconButton as={Link} to="/acc" aria-label="Account settings" icon={<Settings size={21} />} variant="ghost" color="whiteAlpha.800" _hover={{ bg: 'whiteAlpha.300' }} /></Tooltip>
      <Avatar as={Link} to="/dashboard" aria-label="Your dashboard" name={user?.name} src={chatMediaUrl(user?.imageUrl)} size="sm" bg="orange.100" color="orange.800" />
    </Flex>
  );
}
