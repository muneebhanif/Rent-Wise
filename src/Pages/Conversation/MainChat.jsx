import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { fetchConversationsForSidebar } from '../../Api/Chats';
import SideBar from './SideBar';
import SideChat from './SideChat';
import LiveChat from './LiveChat';

export default function MainChat() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef(null);
  const userId = user?._id || user?.id;
  const refresh = useCallback(async () => {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetchConversationsForSidebar(controller.signal);
      if (controller.signal.aborted) return;
      setConversations(Array.isArray(response.data?.data) ? response.data.data : []);
      setError('');
    } catch (err) {
      if (!controller.signal.aborted) setError(err.response?.data?.message || 'Messages could not be refreshed. Please try again.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (request.current === controller) request.current = null;
    }
  }, []);
  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => { if (!document.hidden) refresh(); }, 5000);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      request.current?.abort();
      request.current = null;
    };
  }, [refresh, userId]);
  useEffect(() => {
    const state = location.state;
    if (!state?.ownerIdDetails?._id) return;
    setSelected({ participant: state.ownerIdDetails, listingId: state.listingIdDetails?._id || state.listingIdDetails });
    setMobileOpen(true);
  }, [location.key, location.state]);
  const conversation = selected && conversations.find(item =>
    item.participants?.some(person => String(person._id) === String(selected.participant._id)));
  const choose = (item, participant) => {
    setSelected({ participant, conversationId: item._id });
    setMobileOpen(true);
  };
  return (
    <Flex h="100dvh" minH="0" bg="#f6f7f9" color="gray.800" overflow="hidden">
      <SideBar />
      <Box as="main" flex="1" minW="0" p={{ base: 0, lg: 4 }}>
        <Flex h="full" bg="white" overflow="hidden" borderWidth={{ base: 0, lg: '1px' }} borderColor="gray.200" rounded={{ base: 0, lg: '2xl' }} boxShadow={{ lg: 'sm' }}>
          <SideChat conversations={conversations} userId={userId} selectedId={selected?.participant?._id}
            onSelect={choose} mobileOpen={mobileOpen} loading={loading} error={error} onRetry={refresh} />
          <LiveChat key={selected?.participant?._id || 'empty'} participant={selected?.participant}
            conversation={conversation} initialListingId={selected?.listingId} mobileOpen={mobileOpen}
            onBack={() => setMobileOpen(false)} onSent={refresh} />
        </Flex>
      </Box>
    </Flex>
  );
}
