import React, { useContext, useEffect, useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import { Box, Flex, Text, Button, Container, useColorModeValue, Icon, VStack, Avatar, Menu, MenuButton, MenuList, MenuGroup, MenuItem, MenuDivider, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, MenuIcon } from "@chakra-ui/react"
import { FaUser,FaBell, FaComments, FaList, FaTachometerAlt, FaPlus, FaFileContract, FaSignOutAlt,FaBars, FaChevronDown,FaChartBar ,FaUsers } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import {LogIn, LogOut} from 'lucide-react'
import Logout from '../components/Logout'
import Notification from "../Pages/Notifications/Notification"
import { getNotifications } from "../Api/Notification"
import { NotificationContext } from "../hooks/NotificationContext"
import { useDasboardHook } from "../hooks/DashboardUserContext"





function MainLayout() {
  const { user } = useAuth() // handleLogout
  const {user: DashUser} = useDasboardHook();
  const location = useLocation()
  const navigate = useNavigate()
  const {LogoutUser} = Logout()
  const {setNotifications} = useContext(NotificationContext);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);
  const bgColor = useColorModeValue(
    "linear(to-r, #cfb27b, #eedfbf)",  // Light mode gradient
    "linear(to-r, orange.600, red.500)"   // Dark mode gradient
  );
  
  const hoverBgColor = useColorModeValue("orange.600", "orange.800")
  const textColor = useColorModeValue("white", "gray.100")
  const buttonTextColor = useColorModeValue("gray.200", "orange.300")
  const buttonHoverBgColor = useColorModeValue("gray.800", "gray.600")
  const nonHomeLinkColor = useColorModeValue("gray.800", "gray.600")
  const textHoverHome = useColorModeValue("white", "gray.100")                            // only for landing page
  const hoverBottomLinkHome = useColorModeValue("3px solid white","3px solid gray.100")   // only for landing page

  
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])


  // fetching noification
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response?.data?.data);
      } catch (error) {

      }}
      fetchNotifications()
       
  }, [])


 return (
    <Flex direction="column" minH="100vh" position={'relative'}>
      <ToastContainer />
      {location.pathname !== "/chat" && ( 
      <Box 
  color={textColor} 
  boxShadow="lg"
  borderBottom={location.pathname === '/' ? 'none': '1px solid rgb(223, 221, 221)'}
  position={ location.pathname === '/' ? "absolute" : 'inherit'}  // Absolute positioning
  zIndex={100} // High z-index to be on top
  w="full"
  backdropFilter="blur(10px)" // Blur effect
  pointerEvents="auto" // Allows clicking
  bg="rgba(255, 255, 255, 0.1)" // Semi-transparent background to ensure clicks pass through
>

 <Container maxW="container.xl" py={4}>
      <Flex justifyContent="space-between" alignItems="center">
        {/* Left Side */}
        <Flex alignItems="center">
        <Text
          as={Link}
          color={location.pathname=== '/' ? "white" : "orange.400" }
          to="/"
          fontSize="2xl"
          fontFamily="'Playwrite CU', cursive"
          fontWeight="bold"
          _hover={{ color: location.pathname=== '/' ? 'none' :"orange.600" }}
        >
          RentWise
        </Text>
          
          {/* Nav Items for Medium and Large Screens */}
          <Flex display={{ base: 'none', md: 'flex' }} pl={10} alignItems="center" gap={8}>
            {user && (
              <>
                <Text as={Link} to="/chat" fontWeight="semibold"
                 color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                 _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                 borderBottom={location.pathname === "/chat" ? "3px solid orange" : "none"}
                 leftIcon={<Icon as={FaComments} />}
                >
                  Chats
                </Text>

                <Text as={Link} to="/dashboard" 
                 color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                 _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                 borderBottom={location.pathname === "/dashboard" ? "3px solid orange" : "none"}
                 fontWeight="semibold"
                 leftIcon={<Icon as={FaTachometerAlt} />}
                >
                  Dashboard
                </Text>

                <Text as={Link} to="/media" 
                color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                borderBottom={location.pathname === "/media" ? "3px solid orange" : "none"}
                _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                fontWeight="semibold"
                leftIcon={<Icon as={FaPlus} />}
                >
                  Create Listing
                </Text>

              
{user?.email == "admin@rentwise.com" && (
                  <>
                    <Menu>
                      <MenuButton as={Button}
                        color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                        _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor }}
                        fontWeight="semibold"
                        rightIcon={<Icon as={FaChevronDown} />}
                      >
                        Admin Controls
                      </MenuButton>
                      <MenuList>
                        <MenuItem 
                          as={Link} 
                          to="/agreements-protected" 
                          icon={<Icon as={FaFileContract} />}
                          color={location.pathname === "/agreements-protected" ? "orange.500" : "black"}
                          _hover={{ bg: "orange.50", color: "orange.500" }}
                        >
                          View Agreements
                        </MenuItem>
                        <MenuItem 
                          as={Link} 
                          to="/adminOverview" 
                          icon={<Icon as={FaChartBar} />}
                          color={location.pathname === "/adminOverview" ? "orange.500" : "black"}
                          _hover={{ bg: "orange.50", color: "orange.500" }}
                        >
                          Overview
                        </MenuItem>
                        <MenuItem 
                          as={Link} 
                          to="/admin/users" 
                          icon={<Icon as={FaUsers} />}
                          color={location.pathname === "/admin/users" ? "orange.500" : "black"}
                          _hover={{ bg: "orange.50", color: "orange.500" }}
                        >
                          Users
                        </MenuItem>
                        <MenuItem 
                          as={Link} 
                          to="/admin/listings" 
                          icon={<Icon as={FaList} />}
                          color={location.pathname === "/admin/listings" ? "orange.500" : "black"}
                          _hover={{ bg: "orange.50", color: "orange.500" }}
                        >
                          Listings
                        </MenuItem>
                      </MenuList>                    </Menu>                  </>
                )}       
              </>
            )}
          </Flex>
        </Flex>

        {/* Right Side */}
        <Flex alignItems="center" gap={5} >
        <Flex alignItems={'center'} gap={4} display={{base:'none', md:'flex'}}> 
          {user ? (
            
            <>
            {/* notification route */}
             <Notification />

              <Menu >
                <MenuButton>
                <Avatar size="md" src={`${import.meta.env.VITE_BACK_END_URL}${DashUser?.imageUrl || user?.imageUrl}`} />
                </MenuButton>
                <MenuList color="gray.700">
                  <MenuGroup title="Profile">
                    <MenuItem as={Link} to="/acc">
                      <FaUser size={20} />
                      <span style={{ marginLeft: "10px" }}>My Account</span>
                    </MenuItem>
                    <MenuItem onClick={LogoutUser}>
                      <LogOut size={20} />
                      <span style={{ marginLeft: "10px" }}>Logout</span>
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button as={Link} to="/auth/signIn" borderRadius="full">Login</Button>
          )}
          </Flex>

          {/* Hamburger Menu for Small Screens */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            icon={<FaBars />}
            aria-label="Open Menu"
            onClick={toggleDrawer}
          />
        </Flex>
      </Flex>

      {/* Drawer for Small Screens */}
      <Drawer isOpen={isOpen} placement="right" onClose={closeDrawer} zIndex={1000}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              

            <Menu >
                <MenuButton>
                  <Avatar size="md" src={`${import.meta.env.VITE_BACK_END_URL}${DashUser?.imageUrl || user?.imageUrl}`} />
                </MenuButton>
                <MenuList color="gray.700">
                  <MenuGroup title="Profile">
                    <MenuItem as={Link} to="/acc">
                      <FaUser size={20} />
                      <span style={{ marginLeft: "10px" }}>My Account</span>
                    </MenuItem>
                    <MenuItem onClick={LogoutUser}>
                      <LogOut size={20} />
                      <span style={{ marginLeft: "10px" }}>Logout</span>
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>

              <Text as={Link} to="/" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }}>Home</Text>
              <Text as={Link} to="/chat" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }}>Chats</Text>
              <Text as={Link} to="/dashboard" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }}>Dashboard</Text>
              <Text as={Link} to="/media" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }}>Create Listing</Text>
              { !user && <Text display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} as={Link} to="/auth/signIn" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }} fontWeight={'semibold'}>Login <LogIn /> </Text>}
              {user?._id === "670ba87a096754e9bda6658f" && (
                <Text as={Link} to="/agreements-protected" onClick={closeDrawer} color="gray.600" _hover={{ color: 'blue.600' }}>View Agreements</Text>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
</Box>
) }


      <Flex as="main" flexGrow={1} bg={"whiteAlpha.500"}>
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>

     
    </Flex>
  )
}

export default MainLayout

