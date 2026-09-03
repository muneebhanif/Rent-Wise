import { Link } from 'react-router-dom';
import { Box, Button, Heading } from '@chakra-ui/react'; // If using Chakra UI

export default function Navbar() {
  return (
    <Box display="flex" gap="4" p="4" justifyContent={'space-between'} bg={'white'} minH={'150px'} >
        <Heading fontFamily= "'Playwrite CU', cursive"  
  >RentWise</Heading>
        <Box>
      {/* Replace with Chakra UI Buttons or Links if needed */}
      <Button as={Link} to="/" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Home
      </Button>
      <Button as={Link} to="/search" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Search
      </Button>
      <Button as={Link} to="/searchResults" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Search Results
      </Button>
      <Button as={Link} to="/renterDash" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Renter Dashboard
      </Button>
      <Button as={Link} to="/payment" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Payment
      </Button>
      <Button as={Link} to="/ownerDash" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3}>
        Owner Dashboard
      </Button>
      <Button as={Link} to="/listingDetails" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3} mt={2}>
        Listing Detail
      </Button>
      <Button as={Link} to="/ItemDetail" colorScheme="teal" _hover={{color:'black',background:'none',border:'1px solid black'}} mx={3} mt={2}>
         ItemDetail
      </Button>
      {/* Add more navigation links as needed */}
      </Box>
    </Box>
  );
}
