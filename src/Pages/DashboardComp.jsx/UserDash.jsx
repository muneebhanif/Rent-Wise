import { useState } from 'react';
import { Box, Button, Flex, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { CalendarDays, CheckCircle2, Clock3, FileText, MessageSquare, RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRentalDashboard from '../../hooks/useRentalDashboard';
import { chatMediaUrl } from '../Conversation/chatMedia';
import { agreementPath, Empty, Filters, formatDate, LoadError, Loading, money, Stats, StatusBadge } from './RentalUI';

export default function UserDash() {
  const { agreements, loading, refreshing, error, refresh } = useRentalDashboard();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  if (loading) return <Loading />;
  const count = state => agreements.filter(item => item.rentalState === state).length;
  const shown = agreements.filter(item => (filter === 'all' || (filter === 'history' ? ['completed', 'rejected', 'cancelled'].includes(item.rentalState) : item.rentalState === filter)) && (item.listingId?.title || '').toLowerCase().includes(search.trim().toLowerCase()));
  return <Box>
    <LoadError error={error} onRetry={refresh} />
    <Flex justify="space-between" align="center" gap={3} mb={5} wrap="wrap"><Box><Heading size="md" letterSpacing="-0.5px">Your rentals, in one place</Heading><Text fontSize="sm" color="gray.500" mt={1}>Keep track of what you’re renting and what’s next.</Text></Box><Flex gap={2}><Button aria-label="Refresh renter dashboard" onClick={refresh} isLoading={refreshing} variant="outline" size="sm"><RefreshCw size={16} /></Button><Button as={Link} to="/getAll" size="sm" leftIcon={<Search size={16} />} colorScheme="teal">Find a rental</Button></Flex></Flex>
    <Stats items={[{ label: 'Currently renting', value: count('rented'), description: 'Your active rentals', icon: CalendarDays, accent: true }, { label: 'Upcoming', value: count('upcoming'), description: 'Confirmed and starting soon', icon: Clock3 }, { label: 'Awaiting agreement', value: count('pending'), description: 'Not rented yet', icon: FileText }, { label: 'Completed', value: count('completed') + count('cancelled'), description: 'Past & cancelled rentals', icon: CheckCircle2 }]} />
    <Filters search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} options={[[ 'all', 'All rentals' ], ['rented', 'Renting now'], ['upcoming', 'Upcoming'], ['pending', 'Pending'], ['history', 'History']]} />
    {!shown.length ? <Empty filtered={!!search || filter !== 'all'} /> : <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>{shown.map(agreement => {
      const listing = agreement.listingId;
      const details = agreement.agreementDetailsId?.aggrementDetail || {};
      const path = agreementPath(agreement);
      const pending = agreement.rentalState === 'pending';
      const isCancelling = agreement.rentalState === 'cancellation_requested' || agreement.cancellation?.status === 'pending';
      return <Box key={agreement._id} bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" p={{ base: 4, md: 5 }}><Flex gap={4}><Image w="80px" h="80px" objectFit="cover" rounded="xl" src={chatMediaUrl(listing?.images?.[0]?.url)} fallbackSrc="/images/make_listing/random.png" alt={listing?.title || 'Rental'} /><Box flex="1" minW="0"><StatusBadge state={agreement.rentalState} /><Heading as="h3" mt={2} size="sm" noOfLines={1}>{listing?.title || 'Listing no longer available'}</Heading><Text fontSize="xs" color="gray.500" mt={1}>Owner: {agreement.ownerId?.name || 'Member unavailable'}</Text></Box></Flex><SimpleGrid columns={2} gap={4} my={5} p={4} bg="gray.50" rounded="xl"><Box><Text fontSize="10px" color="gray.500" textTransform="uppercase" letterSpacing="0.7px">Start date</Text><Text fontSize="sm" fontWeight="semibold" mt={1}>{formatDate(details.startDate)}</Text></Box><Box><Text fontSize="10px" color="gray.500" textTransform="uppercase" letterSpacing="0.7px">End date</Text><Text fontSize="sm" fontWeight="semibold" mt={1}>{formatDate(details.endDate)}</Text></Box></SimpleGrid><Flex justify="space-between" align="center" mb={4}><Text fontSize="xs" color="gray.500">Agreed rent</Text><Text fontWeight="bold">{money(details.rentAmount ?? details.RentAmount ?? listing?.price)}</Text></Flex>{pending && <Text fontSize="xs" color="orange.700" bg="orange.50" p={3} rounded="lg" mb={4}>{!agreement.ownerConfirmed ? 'Waiting for the owner to confirm the agreement.' : 'Review and confirm the agreement to complete your booking.'}</Text>}{isCancelling && <Text fontSize="xs" color="red.700" bg="red.50" p={3} rounded="lg" mb={4} fontWeight="medium">The owner has requested to cancel this agreement. Please review and confirm the cancellation agreement.</Text>}<Flex gap={2} wrap="wrap">{path && <Button as={Link} to={path} colorScheme={isCancelling ? 'red' : 'teal'} size="sm" flex="1">{isCancelling ? 'Review cancellation' : pending && agreement.ownerConfirmed ? 'Review agreement' : 'View agreement'}</Button>}{agreement.ownerId?._id && <Button as={Link} to="/chat" state={{ ownerIdDetails: agreement.ownerId, listingIdDetails: listing?._id }} size="sm" variant="outline" leftIcon={<MessageSquare size={15} />}>Message owner</Button>}</Flex></Box>;
    })}</SimpleGrid>}
  </Box>;
}
