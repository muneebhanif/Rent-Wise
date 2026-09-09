import { Badge, Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import { PackageOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const states = {
  available: { label: 'Available', color: 'green' },
  rented: { label: 'Rented', color: 'teal' },
  pending: { label: 'Agreement pending', color: 'orange' },
  upcoming: { label: 'Rented (Upcoming)', color: 'blue' },
  cancellation_requested: { label: 'Cancellation requested', color: 'red' },
  cancelled: { label: 'Cancelled', color: 'gray' },
  completed: { label: 'Completed', color: 'gray' },
  rejected: { label: 'Not accepted', color: 'red' },
  unpublished: { label: 'Unpublished', color: 'gray' },
};
export const agreementPath = (agreement, owner = false) => {
  const category = agreement.listingId?.category;
  if (!['car', 'house', 'hostel'].includes(category)) return null;
  const name = category.charAt(0).toUpperCase() + category.slice(1);
  return owner ? `/agreement${name}/${agreement._id}` : `/view${name}Agreement/${agreement._id}`;
};
export const formatDate = date => date && Number.isFinite(new Date(date).getTime()) ? new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not specified';
export const money = value => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Number(value) || 0);
export function StatusBadge({ state }) {
  const info = states[state] || { label: 'Status unavailable', color: 'gray' };
  return <Badge colorScheme={info.color} rounded="full" px={2.5} py={1} fontSize="10px" textTransform="none" letterSpacing="0.1px">{info.label}</Badge>;
}
export function Stats({ items }) {
  return <SimpleGrid columns={{ base: 2, lg: 4 }} gap={{ base: 3, md: 4 }} mb={7}>{items.map(({ label, value, description, icon: Icon, accent }) => <Box key={label} bg={accent ? '#173d34' : 'white'} color={accent ? 'white' : 'gray.800'} p={{ base: 4, md: 5 }} rounded="2xl" borderWidth="1px" borderColor={accent ? '#173d34' : 'gray.200'}><Flex justify="space-between" align="center" gap={2}><Text fontSize="xs" fontWeight="semibold" opacity={0.8}>{label}</Text><Icon size={18} opacity={0.65} /></Flex><Text mt={4} fontSize="32px" fontWeight="bold" letterSpacing="-1px" lineHeight={1}>{value}</Text><Text mt={2} fontSize="11px" opacity={0.65}>{description}</Text></Box>)}</SimpleGrid>;
}
export function Filters({ search, onSearch, filter, onFilter, options }) {
  return <Flex gap={3} direction={{ base: 'column', lg: 'row' }} justify="space-between" mb={5}><Flex wrap="wrap" gap={1.5}>{options.map(([key, label]) => <Button key={key} size="sm" rounded="full" fontSize="xs" px={4} bg={filter === key ? '#173d34' : 'white'} color={filter === key ? 'white' : 'gray.600'} borderWidth="1px" borderColor={filter === key ? '#173d34' : 'gray.200'} _hover={{ bg: filter === key ? '#24594b' : 'gray.100' }} aria-pressed={filter === key} onClick={() => onFilter(key)}>{label}</Button>)}</Flex><InputGroup maxW={{ lg: '250px' }}><InputLeftElement h="36px" pointerEvents="none"><Search size={16} color="#718096" /></InputLeftElement><Input aria-label="Search rentals" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search by listing name" bg="white" size="sm" rounded="lg" h="36px" /></InputGroup></Flex>;
}
export function Empty({ filtered, owner }) {
  return <Flex direction="column" align="center" textAlign="center" p={10} bg="white" borderWidth="1px" borderStyle="dashed" borderColor="gray.300" rounded="2xl"><PackageOpen size={34} color="#718096" /><Heading size="sm" mt={4}>{filtered ? 'No matching rentals' : owner ? 'Make room for your first listing' : 'Your rental journey starts here'}</Heading><Text maxW="360px" fontSize="sm" color="gray.500" mt={2}>{filtered ? 'Try another filter or search term.' : owner ? 'Add a listing to manage its availability and agreements here.' : 'Explore available listings. Your pending, current, and past rentals will appear here.'}</Text>{!filtered && <Button as={Link} to={owner ? '/media' : '/getAll'} mt={5} colorScheme="teal" size="sm">{owner ? 'Create a listing' : 'Explore listings'}</Button>}</Flex>;
}
export function Loading() {
  return <Box aria-label="Loading dashboard"><SimpleGrid columns={{ base: 2, lg: 4 }} gap={4} mb={7}>{[1, 2, 3, 4].map(i => <Skeleton key={i} h="135px" rounded="2xl" />)}</SimpleGrid><Skeleton h="320px" rounded="2xl" /></Box>;
}
export function LoadError({ error, onRetry }) {
  return error ? <Flex role="alert" bg="red.50" color="red.700" p={4} rounded="xl" gap={3} mb={5} align="center" justify="space-between"><Text fontSize="sm">{error}</Text><Button size="sm" onClick={onRetry} flexShrink={0}>Retry</Button></Flex> : null;
}
