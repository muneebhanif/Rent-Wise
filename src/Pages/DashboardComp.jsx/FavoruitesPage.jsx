import React, { useState, useEffect } from 'react'
import { Box, Grid, Text, Image, Badge, VStack, Heading, Button , Flex } from '@chakra-ui/react'
import { GetFav } from '../../Api/ListingApi'
import { Link } from 'react-router-dom'
import SpinLoader from '../../components/Style/SpinLoader';
const baseUrl = import.meta.env.VITE_BACK_END_URL;
function FavoruitesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await GetFav()
        setFavorites(response.data.favoriteListings)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

 if (loading) {
     return (
       <Flex flexDir={'column'} justify="center" align="center" height="100vh">
         {/* <Spinner size="xl" /> */}
         <SpinLoader/>
       </Flex>
     );
   }

  return (
    <Box px={{ base: 4, md: 8 }} py={8}>
    <Heading mb={6} fontSize={{ base: "2xl", md: "3xl" }}>
      My Favorite Listings
    </Heading>
  
    <Grid 
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
      gap={6}
    >
      {favorites.length > 0 ? (
        favorites.map((listing) => (
          <Box
            key={listing._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow="sm"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md', transition: 'all 0.2s' }}
          >
            <Image
              src={
                listing?.images && listing?.images.length > 0
                  ? `${baseUrl}${listing.images[0].url}`
                  : "/images/make_listing/random.png"
              }
              alt={listing.title}
              height={{ base: "150px", md: "200px" }}
              width="100%"
              objectFit="cover"
            />
  
            <VStack p={4} align="start" spacing={2}>
              <Heading fontSize={{ base: "md", md: "lg" }}>{listing.title}</Heading>
              <Badge colorScheme="orange">{listing.category}</Badge>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="bold">
                ${listing.price}/{listing.priceUnit}
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} noOfLines={2}>
                {listing.description}
              </Text>
  
              <Button
                as={Link}
                to={`/rental/${listing._id}`}
                colorScheme="orange"
                width="full"
                size={{ base: "sm", md: "md" }}
              >
                View Details
              </Button>
            </VStack>
          </Box>
        ))
      ) : (
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          You haven't added any listings to your favorites yet.
        </Text>
      )}
    </Grid>
  </Box>
  
  )
}

export default FavoruitesPage