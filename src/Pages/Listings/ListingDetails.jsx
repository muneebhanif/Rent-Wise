import React, { useContext, useEffect, useMemo, useState } from "react";
import { ListingsContext } from "../../hooks/ListingsContext";
import { getOneUserListingAPI, AddFav, GetFav } from "../../Api/ListingApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  IconButton,
  Spinner,
  Flex,
  Divider,
  VStack,
  Text,
  Avatar,
  Button,
  Textarea,
  HStack,
  useToast,
  Badge,
  Grid,
  GridItem,
  Heading,
  ListItem,
  ListIcon,
  List,
  Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure,
  Stack
} from "@chakra-ui/react";
import {
  StarIcon,
  MapPinIcon,
  MapPin,
  MessageCircleIcon,
  CarIcon,
  FuelIcon as GasPumpIcon,
  UsersIcon,
  ArrowLeft,
  ArrowRight,
  Heart,
  BedDouble,
  Bath,
} from "lucide-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../../hooks/AuthContext";
import { Link } from "react-router-dom";

// import DisplayListingComments from './Comments/DisplayListingComments';
import AddCommentsInListing from "./Comments/CommentsInListing";
import { FaStar } from "react-icons/fa";
import ReviewsInListing from "./Comments/ReviewsInListing";
import ColorTubeLoader from "../../components/Style/ColorTubeLoader";
import BiddingSystem from "./BiddingSystem";
import DisplayLocation from "../Location/DisplayLocation";

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { user } = useAuth();
  const toast = useToast();
  const [avgRating, setAvgRating] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
const [selectedMedia, setSelectedMedia] = useState(null);


  const mediaList = useMemo(() => {
  return [
    ...(currentListing?.images || []).map((img) => ({ ...img, type: "image" })),
    ...(currentListing?.videos || []).map((vid) => ({ ...vid, type: "video" })),
  ];
}, [currentListing]);

useEffect(() => { console.log(selectedMedia)}, [selectedMedia]);


  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await GetFav();
        const isListingFavorite = response.data.favoriteListings.some(
          listing => listing._id === currentListing._id
        );
        setIsFavorite(isListingFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (currentListing?._id && user) {
      checkFavoriteStatus();
    }
  }, [currentListing, user]);



  const handleAddToFavorites = async () => {
    try {
      const response = await AddFav(currentListing._id);
      setIsFavorite(!isFavorite);
       toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  // const handleImageClick = (imgSrc) => {
  //   setSelectedImage(imgSrc);
  //   onOpen();
  // };

  const handleMediaClick = (media) => {
  setSelectedMedia(media);
  onOpen();
};

  useEffect(() => {
 
    const fetchRentalDetails = async () => {
      try {
        const response = await getOneUserListingAPI(id);
        dispatch({ type: "GET_ONE_LISTING", payload: response.data });
      } catch (error) {
        console.error("Error fetching rental details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [id]);


  // const handleImageNavigation = (direction) => {
  //   setCurrentImageIndex((prevIndex) =>
  //     direction === "next"
  //       ? (prevIndex + 1) % currentListing.images.length
  //       : (prevIndex - 1 + currentListing.images.length) %
  //       currentListing.images.length
  //   );
  // };
  const handleMediaNavigation = (direction) => {
  setCurrentMediaIndex((prevIndex) =>
    direction === "next"
      ? (prevIndex + 1) % mediaList.length
      : (prevIndex - 1 + mediaList.length) % mediaList.length
  );
};

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        {/* <Spinner size="xl" /> */}
        <ColorTubeLoader />
      </Flex>
    );
  }

  const handleChatButtonClick = () => {
    // navigate(`/chat/${currentListing.owner._id}/${currentListing._id}/${user._id}`);
    navigate(`/chat`, {
      state: {
        ownerIdDetails: currentListing.owner,
        listingIdDetails: currentListing._id,
        userIdDetails: user,
      },
    });
  };
  const StarRating = ({ rating }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );

  return (
    <Box
      borderRadius={"10px"}
      bg="orange.50"
      _dark={{ bg: "gray.900" }}
      minH="100vh"
      py={8}
    
    >
      <Box maxW="container.xl" mx="auto" px={4}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          <GridItem>
            {/* left side details of pages */}
            <VStack spacing={6} align="start">
              <Heading
                as="h1"
                size="xl"
                color="gray.900"
                _dark={{ color: "white" }}
              >
                {currentListing?.title}
              </Heading>
              <Flex  gap={4} flexDir={{base:'column', sm:'row'}}>
                <Badge colorScheme="orange" px={3} py={1} fontSize="m" w={'fit-content'}>
                  Pkr{currentListing?.price}/{currentListing?.priceUnit}
                </Badge>
                <Flex align="center">
                  <StarRating rating={avgRating} />
                  <Text ml={1} color="gray.700" _dark={{ color: "gray.300" }}>
                    {" "}
                    ({avgRating} reviews)
                  </Text>


                  {/* <Text ml={1} color="gray.700" _dark={{ color: 'gray.300' }}>Reviews/Rating -- add it later</Text>  */}
                </Flex>
                {user && user._id !== currentListing?.owner?._id && (
                  <IconButton
                    aria-label="Add to favorites"
                    icon={<Heart fill={isFavorite ? "red" : "none"} color={isFavorite ? "red" : "currentColor"} />}
                    variant="outline"
                    colorScheme="red"
                    onClick={handleAddToFavorites}
                    _hover={{ bg: 'red.100' }}
                  />
                )}
              </Flex>

              {/* images and its arrow */}
              <Box
                position="relative"
                w={{base:"95%", sm:"100%"}}
                h={"70%"}
                // maxW="600px"
                // mx="4"
                aspectRatio={16 / 9} // Maintain aspect ratio
              >
                {/* <Image
                  src={
                    currentListing?.images && currentListing?.images?.length > 0
                      ? `${baseUrl}${currentListing.images[currentImageIndex].url}`
                      : "/images/make_listing/random.png" // Default image path
                  }
                  alt={'Cant load picture right now'}

                  objectFit="cover"
                  borderRadius="lg"
                  w="100%"
                  h="100%"
                  onClick={() => handleImageClick(`${baseUrl}${currentListing.images[currentImageIndex].url}`)}
                  _hover={{ filter: "brightness(1.2)", transition: "0.2s" }}

                /> */}
                {mediaList[currentMediaIndex]?.type === "image" ? (
  <Image
    src={`${baseUrl}${mediaList[currentMediaIndex].url}`}
    alt="Preview"
    objectFit="cover"
    borderRadius="lg"
    w="100%"
    h="100%"
    onClick={() => handleMediaClick(mediaList[currentMediaIndex])}
    _hover={{ filter: "brightness(1.2)", transition: "0.2s" }}
  />
) : (
  <Box
    as="video"
    src={`${baseUrl}${mediaList[currentMediaIndex].url}`}
    controls
    borderRadius="lg"
    w="100%"
    h="100%"
    onClick={() => handleMediaClick(mediaList[currentMediaIndex])}
  />
)}


                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent minW={'60vw'}>
                    <ModalCloseButton
                      color="white"
                      backgroundColor="black"
                      _hover={{ backgroundColor: "gray.600" }}
                      borderRadius="50%"
                      boxSize="40px"
                    />
                    <ModalBody p={4}>
                      {/* {selectedImage && <Image src={selectedImage} borderRadius="md" />} */}
                      {selectedMedia?.type === "image" ? (
  <Image src={`${baseUrl}${selectedMedia?.url}`} borderRadius="md" />
) : (
  <Box as="video" src={`${baseUrl}${selectedMedia?.url}`} controls autoPlay w="100%" borderRadius="md" />
)}

                    </ModalBody>
                  </ModalContent>
                </Modal>

                {/* {currentListing?.images &&
                  currentListing?.images?.length > 1 && (
                    <>

                      <Button
                        position="absolute"
                        top="50%"
                        left="10px"
                        transform="translateY(-50%)"
                        onClick={() => handleImageNavigation("prev")}
                        _hover={{

                          transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                        }}
                        zIndex="1"
                        colorScheme="none"
                        aria-label="Previous Image"
                      >
                        <ArrowLeft size={'40px'} color="#ffffff" />
                      </Button>


                      <Button
                        position="absolute"
                        top="50%"
                        right="10px"
                        transform="translateY(-50%)"
                        _hover={{

                          transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                        }}
                        onClick={() => handleImageNavigation("next")}
                        zIndex="1"
                        colorScheme="none"
                        aria-label="Next Image"
                      >
                        <ArrowRight size={'40px'} color="#ffffff" />
                      </Button>

                    </>

                  )} */}
                  {mediaList.length > 1 && (
  <>
    <Button
      position="absolute"
      top="50%"
      left="10px"
      transform="translateY(-50%)"
      onClick={() => handleMediaNavigation("prev")}
      _hover={{
        transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
      }}
      zIndex="1"
      colorScheme="none"
      aria-label="Previous Media"
    >
      <ArrowLeft size={'40px'} color="#ffffff" />
    </Button>

    <Button
      position="absolute"
      top="50%"
      right="10px"
      transform="translateY(-50%)"
      onClick={() => handleMediaNavigation("next")}
      _hover={{
        transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
      }}
      zIndex="1"
      colorScheme="none"
      aria-label="Next Media"
    >
      <ArrowRight size={'40px'} color="#ffffff" />
    </Button>
  </>
)}

              </Box>

              {/* Comments and Reviews displayed on top after images in large screen but not displayed in small screens */}
              <Flex
                w={'full'}
                flexDir={"column"}
                gap={4}
                display={{ base: "none", md: "flex" }}
              >
                <ReviewsInListing setAvgRating={setAvgRating} listingID={currentListing?._id} ownerID={currentListing?.owner._id} />
                <AddCommentsInListing
                  toast={toast}
                  id={id}
                  currentID={currentListing?._id}
                  ownerID={currentListing?.owner._id}
                />

                {/* <DisplayListingComments currentID={currentListing?._id}/> */}
              </Flex>
            </VStack>
          </GridItem>

          {/* right side details, including location, owner, description, rules */}
          <VStack spacing={6} w={{base:"90vw", sm:'100%'}} mt={{base:'none', md:'123px'}} >
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
              //w={{base:'100vw',sm:"full"}}
              // w={'auto'}
              w={'inherit'}
            
              
            >
              <Heading
                as="h3"
                fontSize={"2xl"} fontWeight={'semibold'}
                color="gray.900"
                _dark={{ color: "white" }}
                mb={4}
              >
                Location
              </Heading>
              
              {
                currentListing?.location ? (
                  <Flex align="center" gap={4} flexDir={'column'}>
                  <DisplayLocation latitude={currentListing?.location?.coordinates.latitude}
                                   longitude={currentListing?.location?.coordinates.latitude}
                                   address={currentListing?.location?.address}
                  />
                
                <Flex gap={2}>
                  <Stack alignSelf={'self-start'}><MapPin size={'23px'} color="#000000" /></Stack>
                  <Text>{currentListing?.location?.address}</Text>
                </Flex>              
              </Flex>

                ) : (<Text> No location shared from Owner, you can contact him/her for the location</Text> )}
            </Box>

            {user?._id !== currentListing?.owner?._id && (
              <Box
                bg="white"
                _dark={{ bg: "gray.800" }}
                p={6}
                borderRadius="lg"
                shadow="md"
                // w="full"
                w={'inherit'}
              >
                <Heading
                  as="h3"
                  fontSize={"2xl"} fontWeight={'semibold'}
                  color="gray.900"
                  _dark={{ color: "white" }}
                  mb={4}
                >
                  Owner
                </Heading>
                {/* <Text color="gray.700" _dark={{ color: 'gray.300' }} mb={4}>{carData.owner}</Text> */}
                <Flex alignItems={"center"} gap={3} mb={4}>
                  <Avatar
                    src={
                      `${import.meta.env.VITE_BACK_END_URL}${currentListing?.owner?.imageUrl
                      }` || currentListing?.owner?.imageUrl
                    }
                  />
                  <Text color="gray.700" _dark={{ color: "gray.300" }} mb={4}>
                    {currentListing?.owner?.name}
                  </Text>
                </Flex>

                {/* owner ki profile */}
                <Flex alignItems={"center"} flexDir={'column'} gap={2}>
                  <Button
                    onClick={handleChatButtonClick}
                    leftIcon={<MessageCircleIcon size={20} />}
                    variant={"customButton"}
                    w="full"
                  >
                    Chat with Owner
                  </Button>

                  <Button
                    as={Link}
                    to={`/profile/${currentListing?.owner?._id}`}
                    bg={"white"}
                    color={"orange.500"}
                    border={"1px solid orange"}
                    _hover={{ bg: "orange.400", color: "white" }}
                    w="full"
                  >
                    View Owner Profile
                  </Button>
                </Flex>
              </Box>
            )}

          {/* Amenities */}
            {currentListing?.category !== "car" && (
              <Box
                bg="white"
                _dark={{ bg: "gray.800" }}
                p={6}
                borderRadius="lg"
                shadow="md"
                // w="full"
                w={'inherit'}
              >
                <Heading mb={4} fontSize={"28px"} fontWeight={'semibold'}>
                  Amenities
                </Heading>
                <List spacing={3}>
                  {currentListing?.amenities?.length > 0 ? (
                    currentListing?.amenities?.map((amenities, index) => (
                      <ListItem key={index} fontSize="md" color="gray.600">
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {amenities}
                      </ListItem>
                    ))
                  ) : (
                    <Text>No Amenities added yet</Text>
                  )}
                </List>
              </Box>
            )}

            {/* disctiption */}
            
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
            //  w="full"
            w={'inherit'}
            >
              <Heading mb={4} fontSize={"2xl"} fontWeight={'semibold'}>
                Description
              </Heading>
              
              {/* facilities inside description for house and hostel ones */}
                <Box>
                  {
                  (currentListing?.category === "house" || currentListing?.category === 'hostel') && (
                    <div className="flex justify-between items-center mb-2 text-orange-700">
                     <span className="flex items-center">
                        <BedDouble className="w-5 h-5 mr-1" /> {currentListing?.facilities?.bedrooms || 0}
                      </span>
                     <span className="flex items-center">
                        <Bath className="w-5 h-5 mr-1" /> {currentListing?.facilities?.bathrooms || 0}
                     </span>
                    </div>
                  )
                }
                </Box>
                
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                {currentListing?.description || "NO description added"}
              </Text>
            </Box>

            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
             // w="full"
             w={'inherit'}
            >
              <Heading mb={4} fontSize={"2xl"} fontWeight={'semibold'}>
                Rules
              </Heading>
              <List spacing={3}>
                {currentListing?.rules?.length > 0 ? (
                  currentListing?.rules?.map((rule, index) => (
                    <ListItem key={index} fontSize="md" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      {rule}
                    </ListItem>
                  ))
                ) : (
                  <Text>📝 No rules Defined 📝</Text>
                )}
              </List>
            </Box>

            {/* bidding component */}
            {
              currentListing.bidding !== null && currentListing?.bidding?.enabled && (
                <BiddingSystem currentListing={currentListing} />
              )
            }

          </VStack>

          {/* Comments and Reviews displayed on bottom of page  in small screens but not displayed in large screens */}
          <Flex
            flexDir={"column"}
            gap={4}
            display={{ base: "flex", md: "none" }}
          >
            <ReviewsInListing setAvgRating={setAvgRating} listingID={currentListing?._id} ownerID={currentListing?.owner._id} />
            <AddCommentsInListing
              toast={toast}
              id={id}
              currentID={currentListing?._id}
              ownerID={currentListing?.owner._id}
            />
          </Flex>
        </Grid>
      </Box>
    </Box>
  );
};

export default ListingDetails;
