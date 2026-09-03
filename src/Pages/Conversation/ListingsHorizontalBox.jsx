import React, { useState } from "react";
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react";

const ListingsHorizontalBox = () => {
  const [selectedListing, setSelectedListing] = useState(null);

  // Sample listings data
  const listings = [
    {
      id: 1,
      title: "Listing 1",
      price: "Rs 10,000",
      currentHighestBid: "Rs 12,000",
      minimumBid: "Rs 9,000",
    },
    {
      id: 2,
      title: "Listing 2",
      price: "Rs 15,000",
      currentHighestBid: "Rs 18,000",
      minimumBid: "Rs 14,000",
    },
    {
      id: 3,
      title: "Listing 3",
      price: "Rs 20,000",
      currentHighestBid: "Rs 22,000",
      minimumBid: "Rs 19,000",
    },
    {
      id: 4,
      title: "Listing 4",
      price: "Rs 25,000",
      currentHighestBid: "Rs 28,000",
      minimumBid: "Rs 24,000",
    },
    {
      id: 5,
      title: "Listing 5",
      price: "Rs 30,000",
      currentHighestBid: "Rs 32,000",
      minimumBid: "Rs 29,000",
    },
  ];

  return (
    <Box
      width="100%"
      bg="gray.100"
      p={4}
      borderRadius="md"
      boxShadow="md"
      overflowX="auto"
      maxHeight={'20%'}
      fontSize={'x-small'}

    >
      <Flex gap={4}>
        {listings.map((listing) => (
          <Box
            key={listing.id}
            minWidth="300px"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor={selectedListing === listing.id ? "blue.500" : "gray.200"}
            bg={selectedListing === listing.id ? "blue.50" : "white"}
            cursor="pointer"
            onClick={() => setSelectedListing(listing.id)}
          >
            <HStack><Text fontWeight="bold">{listing.title}</Text>
            <Text>Price: {listing.price}</Text></HStack>
            
            <Text>Current Highest Bid: {listing.currentHighestBid}</Text>
            <Text>Minimum Bid: {listing.minimumBid}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ListingsHorizontalBox;