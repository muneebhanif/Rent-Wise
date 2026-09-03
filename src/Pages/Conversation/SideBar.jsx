import { Box, Flex, VStack, Tooltip, Text } from "@chakra-ui/react";
import { Home, Settings, User, LayoutDashboard, ListCheck, BarChart, HelpCircle, LogOut, Bell} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import Notification from "../Notifications/Notification";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: User, label: "Profile", path: "/acc" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ListCheck, label: "Create Listing", path: "/media" },
  
];


export default function SideBar() {
    const navigate = useNavigate();
    const { LogoutUser } = Logout(); 

    const handleLogout = () => {
        LogoutUser(); // Call the logout function
      };
  return (
    <Flex minH="100vh" bg="gray.100">
      {/* Sidebar */}
      <Box w="16" bg="white" borderRight="1px" borderColor="gray.200" py={4} display="flex" flexDirection="column" alignItems="center">
        {/* Logo */}
        {/* <Box mb={8} h={10} w={10} display="flex" alignItems="center" justifyContent="center" borderRadius="full" bg="blue.500" color="white">
          <Text fontSize="xl" fontWeight="bold">M</Text>
        </Box> */}

        {/* Navigation */}
        <VStack spacing={4} flex={1}>
        <Tooltip label="notification" placement="right" hasArrow>
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              w={10} h={10}
             
              color="white"
            >
             <Notification />
            </Box>
          </Tooltip>
          
          
          {navItems.map((item, index) => (
            <Tooltip key={index} label={item.label} placement="right" hasArrow>
              <Link to={item.path}>
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  w={10} h={10}
                  _hover={{ bg: "gray.200" }}
                >
                  <item.icon size={20} />
                </Box>
              </Link>
            </Tooltip>
          ))}
          
          <Tooltip label="Logout" placement="right" hasArrow>
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              w={10} h={10}
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              onClick={handleLogout} // Call handleLogout when clicked
            >
              <LogOut size={20} />
            </Box>
          </Tooltip>

         
        </VStack>
      </Box>
    </Flex>
  );
}
