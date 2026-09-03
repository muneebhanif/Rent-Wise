import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  Grid,
  GridItem,
  Input,
  Image,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import {
  FaBuilding,
  FaCar,
  FaHotel,
  FaSearch,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { getAllListingAPI } from "../Api/ListingApi";
import {
  SetSubscriptionNotification,
  GetSubscriptionNotification,
  // UpdateSubscription,
} from "../Api/DashboardAPI";
import AnimatedBackground from "./Animated";
import { categories } from "./Listings/Test/staticData";
import { ListingsContext } from "../hooks/ListingsContext";
import { useAuth } from "../hooks/AuthContext";
import { NotificationContext } from "../hooks/NotificationContext";
import Loader from "../components/Style/Loader";

// import NotificationButton from "./Notifications/NotificationButton";

const LandingPage = () => {
  //   my things
  const [checkAlert, setCheckAlert] = useState(false);
  const sectionRef = useRef(null);
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(ListingsContext);
  const listings = Array.isArray(state?.listings) ? state.listings : [];
  const itemsPerPage = 6; // Number of listings per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const [hasSubscription, setHasSubscription] = useState(null);
  const { notifications } = useContext(NotificationContext);
  const [searchQuery, setSearchQuery] = useState("");
  


  // Get the listings for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
 // filtering listings
  const filteredListings = listings.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // setting the listings on the basis if filter 
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllListingAPI();
        const listings = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.listings || [];
        dispatch({ type: "GET_LISTINGS", payload: Array.isArray(listings) ? listings : [] });
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);
  
  useEffect(() => {
    if (!user || checkAlert) return;

    const fetchNotificationSetting = async () => {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const promptKey = `rentwise:notification-prompted:${userId}`;
        if (localStorage.getItem(promptKey) === "1") {
          setCheckAlert(true);
          return;
        }

        const response = await GetSubscriptionNotification();
        setHasSubscription(response.data.hasSubscriptionNotification);
        if (!response.data.hasSubscriptionNotification) {
          // Mark before showing the prompt so React StrictMode or a remount
          // cannot show it twice during the same login.
          localStorage.setItem(promptKey, "1");
          setCheckAlert(true);

          if (typeof Notification === "undefined" || Notification.permission === "denied") {
            return;
          }

          if (Notification.permission === "default") {
            const isAllowed = window.confirm("Do you want to allow notifications?");
            if (!isAllowed) return;
          }

          subscribeToPush();
        }
      } catch (error) {
        console.error("Error fetching notification setting:", error);
      }
    };

    fetchNotificationSetting();
  }, [user, checkAlert]);

  const subscribeToPush = async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: `${import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY}`,
      });


      const response = await SetSubscriptionNotification({ subscription });

      if (response.data?.success) {
        alert("Push Notifications Enabled!");
      }
    } catch (error) {
      console.error("Push Subscription Error:", error);
    }
  }; 

// In your component:
const [displayText, setDisplayText] = useState("Cars");
const [width, setWidth] = useState("4ch"); // Initial width for "Cars"
const rentOptions = ["Cars", "Houses", "hostel"];

useEffect(() => {
  let currentIndex = 0;
  const interval = setInterval(() => {
    currentIndex = (currentIndex + 1) % rentOptions.length;
    setDisplayText(rentOptions[currentIndex]);
    setWidth(`${rentOptions[currentIndex].length}ch`); // Dynamic width
  }, 4000);

  return () => clearInterval(interval);
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* {
        user && <subscibeTo/>
        
      } */}
      {/* just added bg because removed animation */}
       <Box position="relative" overflow="hidden" height="100vh"  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url('/images/HomeCar2.jpg')`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', 
    
  }}  > 
      {/* <AnimatedBackground /> */}
      <Flex position="relative" zIndex={10} height="full" alignItems="center">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex direction="column" alignItems="center" textAlign="center">
            <Heading
              fontSize={{ base: "3xl",sm:"4xl", md: "7xl" }}
              fontWeight="extrabold"
              color="white"
              mb={4}
              className="animate-fade-in-up mainHeading"
            >
              Welcome to <Text as="span" color="yellow.300">RentWise</Text>
            </Heading>
            


            <Text mt={3} maxW={{ base: "md", md: "3xl" }} mx="auto" fontSize={{ base: "sm", md: "2xl" }} color="white">
  Discover premium rentals for{' '}
  <span className="category-text">
    <Text as="span" color="yellow.300">
      {displayText}
    </Text>
  </span>
  <br />
  Your journey begins here.
</Text>



            <Flex mt={10} justifyContent="center" className="animate-fade-in-up animation-delay-600">
              <Box rounded="md" shadow="md">
                <Link to="#search" _hover={{ textDecoration: "none" }}>
                  <Button
                  
                    px={{ base: 2, md: 10 }}
                    py={{ base: 3, md: 7 }}
                    fontSize={{ base: "sm", md: "lg" }}
                    fontWeight="medium"
                    colorScheme="whiteAlpha"
                    color="orange.700"
                    bg="white"
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.3s ease"
                    onClick={handleScroll}
                  >
                    Get started
                  </Button>
                </Link>
              </Box>
              <Box ml={3}>
                <Link to="#featured" _hover={{ textDecoration: "none" }}>
                  <Button
                    px={{ base: 2, md: 10 }}
                    py={{ base: 3, md: 7 }}
                    fontSize={{ base: "sm", md: "lg" }}
                    fontWeight="medium"
                    colorScheme="orange"
                    bg="orange.500"
                    _hover={{ bg: "orange.700" }}
                    transition="all 0.3s ease"
                    onClick={handleScroll}
                  >
                    View listings
                  </Button>
                </Link>
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Box>


      {/* Search Section */}
      <Box
        id="search"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, sm: 6, lg: 8 }}
        py={16}
      >
        <Box textAlign="center">
          <Heading
            fontSize={{ base: "3xl", sm: "5xl" }}
            fontWeight="extrabold"
            color="gray.900"
          >
            Find Your Perfect Rental
          </Heading>
          <Text mt={4} fontSize={{base:"sm",sm:"xl"}} color="gray.600">
            Search through our extensive selection of premium rentals
          </Text>
        </Box>
        <Flex mt={8} justifyContent="center">
          <Input
            bg={"white"}
            type="text"
            placeholder="What would you like to rent?"
            w="60%"
            rounded="md"
            py={3}
            px={4}
            shadow="sm"
            _focus={{
              ringColor: "orange.500",
              borderColor: "orange.500",
              boxShadow: "none",
            }}
            color="orange.500"
            fontSize={{base:"sm",sm:"lg"}}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            px={4}
            py={3}
            bg="orange.500"
            color="white"
            rounded="md"
            _hover={{ bg: "orange.600" }}
            transition="all 0.3s ease"
            onClick={handleScroll}
          >
            <FaSearch className="h-5 w-5" />
          </Button>
        </Flex>
      </Box>

      {/* Categories Section */}

      <Box bg="white" py={24}>
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Heading
            fontSize={{ base: "3xl", sm: "5xl" }}
            fontWeight="extrabold"
            color="gray.900"
            textAlign="center"
          >
            Explore Our Premium Categories
          </Heading>
          <Grid
            mt={20}
            gap={12}
            templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
          >
            {categories.map((category) => (
              <GridItem
                key={category.name}
                bg="orange.50"
                p={14}
                rounded="xl"
                _hover={{ shadow: "2xl" }}
                transition="all 0.3s ease"
              >
                <Box textAlign="center">
                  <category.icon
                    className="text-orange-500"
                    style={{ width: "4rem", height: "4rem", margin: "0 auto" }}
                  />
                  <Heading fontSize="2xl" fontWeight="semibold" mt={4}>
                    {category.name}
                  </Heading>
                  <Text color="gray.600" mt={2}>
                    {category.description}
                  </Text>
                  <Flex
                    fontWeight={"semibold"}
                    as={Link}
                    to={`/categories/${category.name.toLowerCase()}`}
                    color="orange.400"
                    _hover={{ color: "orange.700" }}
                    mt={4}
                    display="inline-flex"
                    alignItems="center"
                  >
                    <Text>Explore {category.name}</Text>
                    <FaArrowRight style={{ marginLeft: "0.5rem" }} />
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Listings Section */}
      <Box id="featured" bg="gray.50" py={24}>
        {loading && (
          <Loader/>
        )}

        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} ref={sectionRef}>
          <Heading
            fontSize={{ base: "3xl", sm: "5xl" }}
            fontWeight="extrabold"
            color="gray.900"
            textAlign="center"
          >
            Featured Premium Rentals
          </Heading>
          <Text
            my={4}
            fontSize={{base:"14px",sm:"18px"}}
            color={"gray.600"}
            textAlign={"center"}
          >
            Experience luxury with our top-tier rental selections
          </Text>
          <Grid
            mt={20}
            gap={12}
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
           
          >
            {paginatedListings &&
              paginatedListings?.length > 0 &&
              paginatedListings.map((rental) => (
                <GridItem
                  key={rental._id}
                  bg="white"
                  rounded="lg"
                  shadow="lg"
                  overflow="hidden"
                >
                  {rental.images && rental.images.length > 0 ? (
                    <Image
                      src={`${import.meta.env.VITE_BACK_END_URL}${rental?.images[0]?.url}`}
                      alt={rental.title}
                      w="full"
                      h={64}
                      objectFit="cover"
                    />
                  ) : (
                    <Image
                      src="images/make_listing/random.png"
                      alt={rental.title}
                      w="full"
                      h={64}
                      objectFit="cover"
                    />
                  )}
                  <Flex flexDir={"column"} gap={4} p={7}>
                    <Flex justifyContent={"space-between"}>
                      <Heading fontSize="xl" fontWeight="semibold">
                        {rental.title}
                      </Heading>
                      <Text fontSize={"lg"} fontWeight={"bold"}>
                        {rental.price}PKR
                      </Text>
                    </Flex>

                    <Button
                      alignSelf={"center"}
                      w={"full"}
                      bg={"orange.400"}
                      _hover={{ bg: "orange.500" }}
                      as={Link}
                      to={`/rental/${rental._id}`}
                      color="orange.50"
                      fontWeight="medium"
                    >
                      View Details
                    </Button>
                  </Flex>
                </GridItem>
              ))}
          </Grid>
          <Flex mt={10} alignItems={"center"} justifyContent={"space-between"}>
            <Button
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
              color={"white"}
              onClick={goToPrevPage}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text textAlign={"center"}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              bg={"orange.400"}
              _hover={{ bg: "orange.500" }}
              color={"white"}
              onClick={goToNextPage}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Call to Action */}

      <Box bgGradient="linear(to-r, orange.500, orange.300)">
        <Container
          maxW="7xl"
          px={{ base: 4, sm: 6, lg: 8 }}
          py={{ base: 16, sm: 24 }}
          textAlign="center"
        >
          <Heading
            fontSize={{ base: "3xl", sm: "5xl" }}
            fontWeight="extrabold"
            color="white"
          >
            Ready to Experience Premium Rentals?
          </Heading>
          <Text mt={6} fontSize={{base:"sm",sm:"xl"}} color="orange.50" maxW="3xl" mx="auto">
            Join RentWise today and unlock access to our exclusive selection of
            high-end rentals. Start your journey towards unparalleled luxury and
            convenience.
          </Text>
          <Button
            as={Link}
            to="/auth/signup"
            mt={12}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            px={{base:3,sm:8}}
            py={7}
            border="1px solid transparent"
            fontSize="lg"
            fontWeight="medium"
            rounded="md"
            color="orange.500"
            bg="white"
            _hover={{ bg: "orange.50" }}
            transition="all 0.3s ease"
          >
            Sign Up for Exclusive Access
          </Button>
        </Container>
      </Box>

      <style jsx="true">{`
        @keyframes slide {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          25% {
            opacity: 1;
          }
          50% {
            opacity: 0;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }
        .animate-slide {
          animation: slide 20s infinite;
        }
        .animate-slide-delayed {
          animation: slide 20s infinite;
          animation-delay: 10s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        /* for the main heading */
        .mainHeading {
  width: 20ch;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid; /* Cursor */
  animation: typing 3s linear infinite alternate-reverse,
             blink-cursor 0.75s step-end infinite;
}

@keyframes typing {
  from {
      width: 10ch;
  }
  to {
      width: 20ch;
  }
}

@keyframes blink-cursor {
  from, to {
      border-color: transparent; /* Hide cursor */
  }
  50% {
      border-color: #ffffff; /* Show cursor */
  }
}
    
   
      `}</style>
    </div>
  );
};

export default LandingPage




// blinking cursor







// .mainHeading {
//   width: 20ch; /* Width of the text */
//   white-space: nowrap; /* Prevent text from wrapping */
//   overflow: hidden; /* Hide overflow */
//   border-right: 2px solid; /* Optional: Add a cursor effect */
//   animation: typing 3s linear infinite alternate-reverse; /* Smooth typing animation */
// }

// @keyframes typing {
//   from {
//       width: 10ch; /* Start with no width */
//   }
//   to {
//       width: 20ch; /* End with full width */
//   }
// }
