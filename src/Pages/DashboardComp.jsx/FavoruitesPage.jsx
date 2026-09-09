import { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Image, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import { ArrowUpRight, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetFav } from '../../Api/ListingApi';
import ListingStatusBadge from '../../components/ListingStatusBadge';
import { chatMediaUrl } from '../Conversation/chatMedia';
import { money } from './RentalUI';

export default function FavouritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await GetFav();
      setFavorites((response.data?.favoriteListings || []).filter(Boolean));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Your favourites could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFavorites(); }, []);

  if (loading) return <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>{[1, 2, 3].map(item => <Skeleton key={item} h="370px" rounded="2xl" />)}</SimpleGrid>;
  if (error) return <Flex role="alert" bg="red.50" color="red.700" p={5} rounded="xl" align="center" justify="space-between" gap={4}><Text fontSize="sm">{error}</Text><Button size="sm" onClick={loadFavorites}>Retry</Button></Flex>;
  if (!favorites.length) return <Flex direction="column" align="center" textAlign="center" p={10} bg="white" borderWidth="1px" borderStyle="dashed" borderColor="gray.300" rounded="2xl"><Flex w="56px" h="56px" bg="red.50" color="red.400" rounded="2xl" align="center" justify="center"><Heart size={25} /></Flex><Heading size="sm" mt={4}>Save the rentals you love</Heading><Text maxW="360px" mt={2} color="gray.500" fontSize="sm">Tap the heart on any listing to keep it close and compare it later.</Text><Button as={Link} to="/getAll" mt={5} bg="#24594b" color="white" _hover={{ bg: '#1b453a' }} size="sm">Explore listings</Button></Flex>;

  return <Box><Flex justify="space-between" align="end" mb={5}><Box><Heading size="md">Saved listings</Heading><Text mt={1} color="gray.500" fontSize="sm">{favorites.length} rental{favorites.length === 1 ? '' : 's'} saved for later</Text></Box></Flex><SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>{favorites.map(listing => <Box key={listing._id} bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" overflow="hidden" transition="transform .2s, box-shadow .2s" _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}><Box position="relative"><Image src={chatMediaUrl(listing.images?.[0]?.url)} fallbackSrc="/images/make_listing/random.png" alt={listing.title || 'Rental listing'} w="full" h="190px" objectFit="cover" /><ListingStatusBadge state={listing.rentalState} position="absolute" top={3} left={3} /></Box><Box p={5}><Text fontSize="10px" color="gray.500" textTransform="uppercase" letterSpacing="1px">{listing.category || 'Rental'}</Text><Heading mt={1} size="sm" noOfLines={1}>{listing.title || 'Rental listing'}</Heading><Flex mt={3} align="center" gap={1.5} color="gray.500"><MapPin size={14} /><Text fontSize="xs" noOfLines={1}>{listing.location?.city || listing.location?.state || listing.location?.country || 'Location not specified'}</Text></Flex><Text mt={4} fontSize="lg" fontWeight="bold">{money(listing.price)}<Text as="span" ml={1} fontSize="xs" color="gray.500" fontWeight="normal">/ {listing.priceUnit}</Text></Text><Button as={Link} to={`/rental/${listing._id}`} mt={5} w="full" size="sm" variant="outline" rightIcon={<ArrowUpRight size={14} />}>View details</Button></Box></Box>)}</SimpleGrid></Box>;
}
