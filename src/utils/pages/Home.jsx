import React from 'react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Grid, Heading, Icon, Image, Input, Text } from '@chakra-ui/react';
import { SearchIcon, StarIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { FaCar, FaBicycle, FaBuilding, FaHotel } from 'react-icons/fa';

export default function Home() {
  const categories = [
    { name: 'Cars', icon: FaCar, description: 'Rent a wide variety of cars for any occasion' },
    { name: 'House', icon: FaBuilding, description: 'Find your perfect temporary home' },
    { name: 'Hotels', icon: FaHotel, description: 'Book luxurious stays for your travels' },
  ];

  const featuredRentals = [
    { id: 1, name: 'Luxury Sedan', category: 'Cars', price: '$80/day', rating: 4.8, image: '/images/sedan.jpeg?' },
    { id: 2, name: 'Beachfront House', category: 'House', price: '$150/night', rating: 4.9, image: '/images/apart.jpeg?height=200&width=300' },
  ];

  return (
    <Box minH="100vh" bg={'rgb(231, 231, 231)'} py={6}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        <Box textAlign="center" mb={12}>
          <Heading as="h1" size="2xl" fontWeight="extrabold" color="gray.800">
            Find Your Perfect Rental
          </Heading>
          <Text mt={5} maxW="xl" mx="auto" fontSize="xl" color="gray.600">
            RentWise offers a wide range of rentals, from cars and Homes to hotels.
          </Text>
        </Box>

        <Box maxW="3xl" mx="auto" mb={12}>
          <Flex mb={4}>
            <Input placeholder="What would you like to rent?" flex="1" mr={2} bg={'white'} />
            <Button leftIcon={<SearchIcon />} size="md" colorScheme="blue">
              Search
            </Button>
          </Flex>
        </Box>

        <Box mb={12}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
            Popular Categories
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {categories.map((category) => (
              <Card key={category.name} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                <CardHeader>
                  <Flex align="center">
                    <Icon as={category.icon} boxSize={6} color="blue.500" mr={3} />
                    <Heading as="h3" size="md">{category.name}</Heading>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>{category.description}</Text>
                </CardBody>
                <CardFooter>
                  <Button variant="link" as={Link} to={`/category/${category.name.toLowerCase()}`} colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
                    Browse {category.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>

        <Box mb={12}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
            Featured Rentals
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {featuredRentals.map((rental) => (
              <Card key={rental.id} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                <CardHeader p={0}>
                  <Image src={rental.image} alt={rental.name} width="100%" height="200px" objectFit="cover" borderRadius="md" />
                </CardHeader>
                <CardBody>
                  <Heading as="h3" size="md" mb={2}>{rental.name}</Heading>
                  <Text>{rental.category}</Text>
                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontWeight="bold" >{rental.price}</Text>
                    <Flex align="center">
                      <StarIcon color="yellow.400" mr={1} />
                      <Text>{rental.rating}</Text>
                    </Flex>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Button as={Link} to={`/rental/${rental.id}`} bg={'black'}color={'white'} _hover={{color:'black', background:'white', border:'1px solid black'}} w="full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
