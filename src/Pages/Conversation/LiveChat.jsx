import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, IconButton, Spinner, Text, Textarea, useToast } from '@chakra-ui/react';
import { ArrowDown, ArrowLeft, Check, CheckCheck, FileText, MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { createMessage, fetchMessagesByConversation } from '../../Api/Chats';
import { chatMediaUrl } from './chatMedia';
import UserPopover from '../DashboardComp.jsx/UserPopover';

const idOf = value => value?._id || value;
function MessageContent({ message }) {
  const text = typeof message.message === 'string' ? message.message : '';
  const match = message.type === 'link' && text.match(/https?:\/\/\S+\/((?:viewHouseAgreement|viewCarAgreement|viewHostelAgreement)\/[a-f\d]{24})/i);
  return match ? <Box><Flex gap={2} align="center" mb={2}><FileText size={18} /><Text fontWeight="bold">Rental agreement</Text></Flex><Text fontSize="sm" mb={3}>Review the details and rental terms.</Text><Button as={Link} to={`/${match[1]}`} size="sm" bg="white" color="gray.800">View agreement</Button></Box>
    : <Text fontSize="sm" whiteSpace="pre-wrap" overflowWrap="anywhere">{text}</Text>;
}
export default function LiveChat({ participant, conversation, initialListingId, mobileOpen, onBack, onSent }) {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState('');
  const [newMessages, setNewMessages] = useState(false);
  const scroll = useRef(null);
  const textarea = useRef(null);
  const nearBottom = useRef(true);
  const mounted = useRef(true);
  const request = useRef(null);
  const sendLock = useRef(false);
  const conversationId = conversation?._id || createdId;
  const refresh = useCallback(async () => {
    if (!conversationId || request.current || sendLock.current) return;
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetchMessagesByConversation(conversationId, controller.signal);
      if (controller.signal.aborted) return;
      const next = Array.isArray(response.data?.data) ? response.data.data : [];
      setMessages(previous => {
        if (next.length > previous.length && !nearBottom.current) setNewMessages(true);
        return next;
      });
      setError('');
    } catch (err) {
      if (!controller.signal.aborted) setError(err.response?.data?.message || 'Could not load messages. Please try again.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (request.current === controller) request.current = null;
    }
  }, [conversationId]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); };
  }, []);
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    refresh();
    const timer = window.setInterval(() => { if (!document.hidden) refresh(); }, 3000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); request.current?.abort(); request.current = null; };
  }, [conversationId, refresh]);
  useEffect(() => {
    if (nearBottom.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages]);
  const submit = async e => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !participant?._id || sendLock.current) return;
    sendLock.current = true;
    setSending(true);
    request.current?.abort();
    request.current = null;
    try {
      const listing = [...new Set([...(conversation?.listing || []).map(idOf), initialListingId].filter(Boolean))];
      const response = await createMessage({ message: text, listing, receiver: participant._id });
      const sent = response.data?.data;
      if (!sent?._id) throw new Error('Message was not saved.');
      if (!mounted.current) return;
      nearBottom.current = true;
      setMessages(previous => previous.some(item => item._id === sent._id) ? previous : [...previous, sent]);
      setCreatedId(idOf(sent.conversation));
      setDraft('');
      setError('');
      setLoading(false);
      onSent();
      textarea.current?.focus();
    } catch (err) {
      if (mounted.current) toast({ title: 'Message not sent', description: err.response?.data?.message || 'Your draft is saved here. Please try sending again.', status: 'error', duration: 5000, isClosable: true });
    } finally {
      sendLock.current = false;
      if (mounted.current) setSending(false);
    }
  };
  const goToBottom = () => {
    nearBottom.current = true;
    setNewMessages(false);
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: 'smooth' });
  };
  return (
    <Flex as="section" aria-label="Message thread" direction="column" flex="1" minW="0" minH="0" bg="#f7f9f9" display={{ base: mobileOpen ? 'flex' : 'none', md: 'flex' }}>
      {!participant ? <Flex flex="1" direction="column" align="center" justify="center" p={8} textAlign="center"><Flex w={88} h={88} rounded="3xl" bg="#e4efe9" color="#24594b" align="center" justify="center" mb={6}><MessageSquare size={38} strokeWidth={1.5} /></Flex><Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="2px" mb={3}>YOUR RENTAL CONVERSATIONS</Text><Heading fontSize={{ base: '24px', lg: '30px' }} letterSpacing="-1px">A good rental starts here.</Heading><Text maxW="340px" mt={4} color="gray.500" lineHeight={1.8}>Select a conversation to discuss a listing, agree on the details, and keep everything in one place.</Text></Flex> : <>
        <Flex bg="white" align="center" justify="space-between" gap={3} px={{ base: 3, md: 6 }} py={4} borderBottomWidth="1px" borderColor="gray.100">
          <Flex align="center" gap={3} minW={0}><IconButton display={{ base: 'flex', md: 'none' }} aria-label="Back to conversations" icon={<ArrowLeft size={20} />} variant="ghost" onClick={onBack} /><Avatar size="sm" name={participant.name} src={chatMediaUrl(participant.imageUrl)} bg="orange.100" color="orange.800" /><Box minW={0}><Text as={Link} to={`/profile/${participant._id}`} fontWeight="bold" noOfLines={1}>{participant.name || 'RentWise member'}</Text><Text fontSize="xs" color="gray.500">Rental conversation</Text></Box></Flex>
          {conversationId && <UserPopover tenant={participant} convoID={conversationId} listings={conversation?.listing || []} />}
        </Flex>
        {!!conversation?.listing?.length && <Flex px={{ base: 3, md: 6 }} py={3} gap={2} overflowX="auto" borderBottomWidth="1px" borderColor="gray.100" bg="white"><Text fontSize="xs" color="gray.500" whiteSpace="nowrap" alignSelf="center">Discussing</Text>{conversation.listing.map(listing => <Button key={listing._id} as={Link} to={`/rental/${listing._id}`} size="xs" variant="outline" rounded="full" flexShrink={0} fontWeight="medium">{listing.title || 'View listing'}</Button>)}</Flex>}
        {error && <Flex role="alert" bg="red.50" color="red.700" p={3} gap={3} align="center"><Text fontSize="sm">{error}</Text><Button onClick={refresh} size="xs" flexShrink={0}>Retry</Button></Flex>}
        <Box ref={scroll} flex="1" minH="0" overflowY="auto" px={{ base: 4, md: 8 }} py={6} onScroll={() => { const el = scroll.current; nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100; if (nearBottom.current) setNewMessages(false); }}>
          {loading && !messages.length ? <Flex justify="center" py={10}><Spinner aria-label="Loading messages" color="teal.600" /></Flex> : !messages.length ? <Box py={12} textAlign="center"><Text fontWeight="semibold">Say hello to {participant.name?.split(' ')[0] || 'your contact'}.</Text><Text mt={2} color="gray.500" fontSize="sm">Ask about availability, pricing, or the rental details.</Text></Box> : <Flex direction="column" gap={3}>{messages.map((message, index) => {
            const mine = String(idOf(message.sender)) === String(user?._id || user?.id);
            const date = message.createdAt ? new Date(message.createdAt) : null;
            const day = date?.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
            const priorDay = index && messages[index - 1].createdAt ? new Date(messages[index - 1].createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
            return <Box key={message._id || index}>{day && day !== priorDay && <Text textAlign="center" fontSize="10px" color="gray.500" my={5}>{day}</Text>}<Flex justify={mine ? 'flex-end' : 'flex-start'}><Box maxW={{ base: '88%', lg: '72%' }} px={4} pt={3} pb={2} rounded="2xl" borderTopRightRadius={mine ? '4px' : '2xl'} borderTopLeftRadius={mine ? '2xl' : '4px'} bg={mine ? '#24594b' : 'white'} color={mine ? 'white' : 'gray.800'} borderWidth={mine ? 0 : '1px'} borderColor="gray.100" boxShadow="sm"><MessageContent message={message} /><Flex mt={2} gap={1} align="center" justify="flex-end" opacity={0.75}><Text fontSize="10px">{date?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Text>{mine && <Box aria-label={message.status === 'read' ? 'Read' : 'Sent'}>{message.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}</Box>}</Flex></Box></Flex></Box>;
          })}</Flex>}
        </Box>
        {newMessages && <Button onClick={goToBottom} alignSelf="center" size="sm" rounded="full" leftIcon={<ArrowDown size={15} />} mb={2} boxShadow="sm">New messages</Button>}
        <Box as="form" onSubmit={submit} bg="white" px={{ base: 3, md: 6 }} pt={4} pb="max(16px, env(safe-area-inset-bottom))" borderTopWidth="1px" borderColor="gray.100">
          <Flex gap={3} align="end" bg="gray.50" borderWidth="1px" borderColor="gray.200" rounded="2xl" p={2}>
            <Textarea ref={textarea} aria-label="Message" placeholder="Write a message…" value={draft} onChange={e => setDraft(e.target.value)} isReadOnly={sending} maxLength={5000} rows={2} minH="52px" maxH="150px" resize="vertical" border={0} _focusVisible={{ boxShadow: 'none' }} fontSize="sm" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} />
            <IconButton type="submit" aria-label="Send message" icon={<Send size={19} />} isLoading={sending} isDisabled={!draft.trim() || sending} bg="#24594b" color="white" _hover={{ bg: '#1b453a' }} rounded="xl" />
          </Flex><Text mt={2} fontSize="10px" color="gray.500" display={{ base: 'none', md: 'block' }}>Enter to send · Shift + Enter for a new line</Text>
        </Box>
      </>}
    </Flex>
  );
}
