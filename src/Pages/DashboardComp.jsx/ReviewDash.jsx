/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, Image, SimpleGrid, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import { ArrowUpRight, MessageSquareText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToGetReview } from '../../Api/DashboardAPI';
import { getUserReviews } from '../../Api/reviews';
import { useAuth } from '../../hooks/AuthContext';
import { chatMediaUrl } from '../Conversation/chatMedia';

function Stars({ rating = 0 }) {
  return <Flex gap={0.5} aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(value => <Star key={value} size={15} fill={value <= rating ? '#f6ad55' : 'transparent'} color={value <= rating ? '#dd6b20' : '#cbd5e0'} />)}</Flex>;
}
const dateText = value => value && Number.isFinite(new Date(value).getTime()) ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date unavailable';

export default function ReviewPage() {
  const { user } = useAuth();
  const [received, setReceived] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError('');
    try {
      const [eligibleResponse, receivedResponse] = await Promise.all([ToGetReview(), getUserReviews(user._id)]);
      setPeople(Array.isArray(eligibleResponse.data?.data) ? eligibleResponse.data.data : []);
      setReceived(Array.isArray(receivedResponse.data?.data?.reviews) ? receivedResponse.data.data.reviews : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Reviews could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  if (loading) return <Box><Skeleton h="48px" maxW="430px" rounded="xl" mb={5} /><Skeleton h="300px" rounded="2xl" /></Box>;
  if (error) return <Flex role="alert" bg="red.50" color="red.700" p={5} rounded="xl" align="center" justify="space-between" gap={4}><Text fontSize="sm">{error}</Text><Button size="sm" onClick={loadReviews}>Retry</Button></Flex>;

  return <Box><Flex justify="space-between" align="end" mb={5}><Box><Heading size="md">Reviews</Heading><Text mt={1} color="gray.500" fontSize="sm">Build trust through honest rental experiences.</Text></Box></Flex><Tabs variant="unstyled" colorScheme="teal"><TabList bg="white" borderWidth="1px" borderColor="gray.200" p={1.5} rounded="xl" w="fit-content" maxW="full" overflowX="auto" mb={5}><Tab flexShrink={0} rounded="lg" px={4} py={2.5} fontSize="sm" color="gray.500" _selected={{ bg: '#edf5f2', color: '#24594b' }}>Received ({received.length})</Tab><Tab flexShrink={0} rounded="lg" px={4} py={2.5} fontSize="sm" color="gray.500" _selected={{ bg: '#edf5f2', color: '#24594b' }}>Ready to review ({people.length})</Tab></TabList><TabPanels><TabPanel p={0}>{received.length ? <VStack spacing={3} align="stretch">{received.map((review, index) => <Flex key={review._id || index} bg="white" borderWidth="1px" borderColor="gray.200" rounded="2xl" p={{ base: 4, md: 5 }} gap={4} align="start"><Avatar name={review.reviewer?.name} src={chatMediaUrl(review.reviewer?.imageUrl)} bg="orange.100" color="orange.800" /><Box flex="1" minW={0}><Flex justify="space-between" gap={3} direction={{ base: 'column', sm: 'row' }}><Box><Text fontWeight="semibold">{review.reviewer?.name || 'RentWise member'}</Text><Stars rating={Number(review.rating) || 0} /></Box><Text fontSize="xs" color="gray.500" flexShrink={0}>{dateText(review.createdAt)}</Text></Flex><Text mt={3} color="gray.600" fontSize="sm" whiteSpace="pre-wrap">{review.comment || 'No written feedback was provided.'}</Text></Box></Flex>)}</VStack> : <EmptyReviews received />}</TabPanel><TabPanel p={0}>{people.length ? <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>{people.map(item => <Flex key={item.agreementId} bg="white" borderWidth="1px" borderColor="gray.200" rounded="2xl" p={4} gap={4} direction={{ base: 'column', sm: 'row' }}><Image src={chatMediaUrl(item.listing?.images?.[0]?.url)} fallbackSrc="/images/make_listing/random.png" alt={item.listing?.title || 'Rental'} w={{ base: 'full', sm: '120px' }} h={{ base: '150px', sm: '100px' }} rounded="xl" objectFit="cover" /><Box flex="1" minW={0}><Heading size="sm" noOfLines={1}>{item.listing?.title || 'Rental listing'}</Heading><Flex align="center" gap={2} mt={2}><Avatar size="xs" name={item.user?.name} src={chatMediaUrl(item.user?.imageUrl)} /><Text fontSize="xs" color="gray.500">with {item.user?.name || 'a RentWise member'}</Text></Flex><Text fontSize="xs" color="gray.500" mt={2}>Rented {dateText(item.agreementDate)}</Text><Flex mt={3} gap={2} wrap="wrap"><Button as={Link} to={`/rental/${item.listing?._id}`} size="xs" variant="outline" rightIcon={<ArrowUpRight size={12} />}>Review listing</Button><Button as={Link} to={`/profile/${item.user?.id || item.user?._id}`} size="xs" variant="ghost" colorScheme="teal">Review person</Button></Flex></Box></Flex>)}</SimpleGrid> : <EmptyReviews />}</TabPanel></TabPanels></Tabs></Box>;
}

function EmptyReviews({ received = false }) {
  return <Flex direction="column" align="center" textAlign="center" p={10} bg="white" borderWidth="1px" borderStyle="dashed" borderColor="gray.300" rounded="2xl"><MessageSquareText size={30} color="#718096" /><Heading size="sm" mt={4}>{received ? 'No reviews yet' : 'Nothing to review yet'}</Heading><Text mt={2} maxW="360px" color="gray.500" fontSize="sm">{received ? 'Reviews from completed rentals will appear here.' : 'After a rental is completed, you can share feedback here.'}</Text></Flex>;
}
