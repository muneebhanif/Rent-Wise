import { useState } from 'react';
import { Box, Button, Flex, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Package, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRentalDashboard from '../../hooks/useRentalDashboard';
import { chatMediaUrl } from '../Conversation/chatMedia';
import { agreementPath, Empty, Filters, formatDate, LoadError, Loading, money, Stats, StatusBadge } from './RentalUI';

export default function OwnerDash() {
  const { listings, agreements, loading, refreshing, error, refresh } = useRentalDashboard(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('listings');
  if (loading) return <Loading />;

  const activeAgreements = agreements.filter(a => ['rented', 'upcoming', 'pending', 'cancellation_requested'].includes(a.rentalState));
  const counts = state => listings.filter(item => item.rentalState === state).length;

  const shown = listings.filter(item => {
    const hasAgr = agreements.some(a => String(a.listingId?._id) === String(item._id) && ['rented', 'upcoming', 'pending', 'cancellation_requested'].includes(a.rentalState));
    const match = filter === 'all'
      || (filter === 'agreements' ? hasAgr : filter === 'rented' ? ['rented', 'upcoming'].includes(item.rentalState) : item.rentalState === filter);
    return match && item.title?.toLowerCase().includes(search.trim().toLowerCase());
  });

  return <Box>
    <LoadError error={error} onRetry={refresh} />
    <Flex justify="space-between" gap={3} align="center" mb={5} wrap="wrap">
      <Box>
        <Heading size="md" letterSpacing="-0.5px">Your rental portfolio</Heading>
        <Text color="gray.500" fontSize="sm" mt={1}>See what’s available, rented, and under active agreement.</Text>
      </Box>
      <Flex gap={2}>
        <Button aria-label="Refresh owner dashboard" size="sm" variant="outline" onClick={refresh} isLoading={refreshing}><RefreshCw size={16} /></Button>
        <Button as={Link} to="/media" leftIcon={<Plus size={16} />} size="sm" colorScheme="teal">New listing</Button>
      </Flex>
    </Flex>

    <Stats items={[
      { label: 'Total listings', value: listings.length, description: 'Your complete portfolio', icon: Package },
      { label: 'Currently rented', value: counts('rented') + counts('upcoming'), description: 'Rentals in progress', icon: CalendarDays, accent: true },
      { label: 'Available', value: counts('available'), description: 'Ready for renters', icon: CheckCircle2 },
      { label: 'With agreement', value: activeAgreements.length, description: 'Active or pending agreements', icon: Clock3 },
    ]} />

    <Flex gap={5} borderBottomWidth="1px" borderColor="gray.200" mb={5}>
      {[['listings', 'My listings'], ['agreements', 'Agreement history']].map(([key, label]) => (
        <Button key={key} onClick={() => setView(key)} variant="unstyled" rounded={0} pb={3} fontSize="sm" color={view === key ? '#24594b' : 'gray.500'} borderBottomWidth="2px" borderColor={view === key ? '#24594b' : 'transparent'} aria-pressed={view === key}>{label}</Button>
      ))}
    </Flex>

    {view === 'listings' ? <>
      <Filters search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} options={[['all', 'All listings'], ['available', 'Available'], ['rented', 'Rented'], ['agreements', 'With agreement'], ['unpublished', 'Unpublished']]} />
      {!shown.length ? <Empty owner filtered={!!search || filter !== 'all'} /> : <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
        {shown.map(listing => {
          const current = agreements.find(agreement => String(agreement.listingId?._id) === String(listing._id) && ['rented', 'upcoming', 'pending', 'cancellation_requested'].includes(agreement.rentalState));
          const details = current?.agreementDetailsId?.aggrementDetail || {};
          const displayState = current ? current.rentalState : listing.rentalState;

          return <Box key={listing._id} bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" overflow="hidden">
            <Box position="relative">
              <Image w="full" h="170px" objectFit="cover" src={chatMediaUrl(listing.images?.[0]?.url)} fallbackSrc="/images/make_listing/random.png" alt={listing.title} />
              <Box position="absolute" top={3} left={3} bg="white" rounded="full">
                <StatusBadge state={displayState} />
              </Box>
            </Box>
            <Box p={5}>
              <Text fontSize="10px" color="gray.500" textTransform="uppercase" letterSpacing="1px">{listing.category}</Text>
              <Heading as="h3" size="sm" mt={1} noOfLines={1}>{listing.title}</Heading>
              <Text mt={2} fontWeight="bold">{money(listing.price)}<Text as="span" fontSize="xs" color="gray.500" fontWeight="normal"> / {listing.priceUnit}</Text></Text>

              <Box mt={4} py={3} borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.100" minH="72px">
                {current ? (
                  <>
                    <Text fontSize="xs" fontWeight="medium" color={current.rentalState === 'cancellation_requested' ? 'red.600' : current.rentalState === 'pending' ? 'orange.600' : 'teal.700'}>
                      {current.rentalState === 'cancellation_requested' ? `Cancellation requested with: ${current.renterId?.name || 'Renter'}`
                        : current.rentalState === 'pending' ? `Pending agreement with: ${current.renterId?.name || 'Renter'}`
                        : `Rented to: ${current.renterId?.name || 'Renter'}`}
                    </Text>
                    <Text mt={1} fontSize="11px" color="gray.500">{formatDate(details.startDate)} – {formatDate(details.endDate)}</Text>
                  </>
                ) : (
                  <Text fontSize="xs" color="gray.600">
                    {listing.rentalState === 'available' ? 'Ready for your next renter' : listing.rentalState === 'rented' ? 'Marked as rented' : 'Not visible in public browsing'}
                  </Text>
                )}
              </Box>

              <Flex mt={4} gap={2}>
                <Button as={Link} to={`/rental/${listing._id}`} size="sm" flex="1" variant="outline" rightIcon={<ArrowUpRight size={14} />}>View listing</Button>
                {current && agreementPath(current, true) ? (
                  <Button as={Link} to={agreementPath(current, true)} size="sm" variant="solid" colorScheme="teal">Agreement</Button>
                ) : (
                  <Button as={Link} to={`/listings/${listing._id}`} size="sm" variant="ghost">Edit</Button>
                )}
              </Flex>
            </Box>
          </Box>;
        })}
      </SimpleGrid>}
    </> : <Box bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" overflow="hidden">
      {!agreements.length ? <Empty owner /> : agreements.map(agreement => {
        const details = agreement.agreementDetailsId?.aggrementDetail || {};
        const path = agreementPath(agreement, true);
        const isCancelling = agreement.rentalState === 'cancellation_requested' || agreement.cancellation?.status === 'pending';
        return <Flex key={agreement._id} gap={4} p={5} borderBottomWidth="1px" borderColor="gray.100" direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <Box flex="1">
            <Text fontWeight="semibold">{agreement.listingId?.title || 'Listing no longer available'}</Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {agreement.renterId?.name || 'Member unavailable'} · {formatDate(details.startDate)} – {formatDate(details.endDate)}
            </Text>
            {isCancelling && (
              <Text fontSize="xs" color="red.600" fontWeight="medium" mt={1}>
                Cancellation Agreement sent · Waiting for renter confirmation
              </Text>
            )}
          </Box>
          <StatusBadge state={agreement.rentalState} />
          {path && <Button as={Link} to={path} variant="outline" size="sm">View agreement</Button>}
        </Flex>;
      })}
    </Box>}
  </Box>;
}
