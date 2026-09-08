import { useState } from 'react';
import { Avatar, Badge, Box, Button, Flex, Heading, IconButton, Input, InputGroup, InputLeftElement, Skeleton, Text } from '@chakra-ui/react';
import { ArrowLeft, MessageSquare, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatMediaUrl } from './chatMedia';

export default function SideChat({ conversations, userId, selectedId, onSelect, mobileOpen, loading, error, onRetry }) {
  const [search, setSearch] = useState('');
  const items = conversations.map(conversation => ({ conversation, person: conversation.participants?.find(p => String(p._id) !== String(userId)) }))
    .filter(item => item.person && `${item.person.name} ${item.conversation.listing?.map(l => l.title).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <Flex as="aside" aria-label="Conversations" direction="column" w={{ base: 'full', md: '310px', xl: '350px' }} flexShrink={0} borderRightWidth="1px" borderColor="gray.100" display={{ base: mobileOpen ? 'none' : 'flex', md: 'flex' }}>
      <Box px={5} pt={6} pb={4}>
        <Flex align="center" gap={2} mb={1}>
          <IconButton as={Link} to="/dashboard" display={{ base: 'flex', md: 'none' }} aria-label="Back to dashboard" size="sm" variant="ghost" icon={<ArrowLeft size={18} />} />
          <Heading fontSize="24px" letterSpacing="-0.7px">Messages</Heading>
          <Badge ml="auto" rounded="full" px={2.5} py={1} colorScheme="gray">{conversations.length}</Badge>
        </Flex>
        <Text fontSize="sm" color="gray.500" mb={5}>Good conversations. Better rentals.</Text>
        <InputGroup><InputLeftElement pointerEvents="none"><Search size={17} color="#718096" /></InputLeftElement><Input aria-label="Search conversations" placeholder="Search people or listings" value={search} onChange={e => setSearch(e.target.value)} bg="gray.50" borderColor="gray.100" rounded="xl" fontSize="sm" /></InputGroup>
      </Box>
      <Flex px={5} pb={3} justify="space-between"><Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="1px">YOUR CONVERSATIONS</Text></Flex>
      {error && <Box role="alert" px={5} pb={3}><Text fontSize="sm" color="red.600">{error}</Text><Button size="xs" variant="link" onClick={onRetry}>Try again</Button></Box>}
      <Box flex="1" overflowY="auto" px={2} pb={3}>
        {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} h="76px" m={2} rounded="xl" />) : items.length ? items.map(({ conversation, person }) => {
          const active = String(person._id) === String(selectedId);
          const unread = conversation.unreadMessagesCount || 0;
          return <Flex as="button" type="button" key={conversation._id} w="full" textAlign="left" gap={3} p={3} mb={1} rounded="xl" bg={active ? '#edf5f2' : 'white'} borderWidth="1px" borderColor={active ? '#d2e8dd' : 'transparent'} _hover={{ bg: active ? '#edf5f2' : 'gray.50' }} _focusVisible={{ boxShadow: 'outline' }} onClick={() => onSelect(conversation, person)} aria-pressed={active}>
            <Avatar name={person.name} src={chatMediaUrl(person.imageUrl)} bg="orange.100" color="orange.800" size="md" />
            <Box flex="1" minW="0"><Flex justify="space-between" align="center" gap={2}><Text noOfLines={1} fontSize="sm" fontWeight="bold">{person.name || 'RentWise member'}</Text><Text fontSize="10px" color="gray.500" flexShrink={0}>{conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</Text></Flex>
              <Text fontSize="xs" color="gray.500" noOfLines={1} mt={1}>{conversation.lastMessage?.message || conversation.listing?.map(l => l.title).filter(Boolean).join(', ') || 'Start a conversation'}</Text>
              <Flex align="center" justify="space-between" mt={1.5}><Text fontSize="10px" color="gray.500">{conversation.listing?.length || 0} linked listing{conversation.listing?.length === 1 ? '' : 's'}</Text>{unread > 0 && <Badge bg="#24594b" color="white" rounded="full" px={2} aria-label={`${unread} unread messages`}>{unread > 99 ? '99+' : unread}</Badge>}</Flex>
            </Box>
          </Flex>;
        }) : <Box textAlign="center" px={5} py={12}><MessageSquare size={28} color="#a0aec0" style={{ margin: '0 auto 16px' }} /><Text fontWeight="semibold">{search ? 'No conversations found' : 'Your inbox is ready'}</Text><Text mt={2} fontSize="sm" color="gray.500">{search ? 'Try a different name or listing.' : 'Open a listing and contact its owner to get started.'}</Text>{!search && <Button as={Link} to="/getAll" mt={4} size="sm" variant="outline">Explore listings</Button>}</Box>}
      </Box>
    </Flex>
  );
}
