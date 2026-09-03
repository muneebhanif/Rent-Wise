import React, { useEffect, useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Icon, Flex, Heading, Text, Button, Avatar, Image } from "@chakra-ui/react";
import { LuFolder, LuUser } from "react-icons/lu";
import OwnerDash from '../DashboardComp.jsx/OwnerDash';
import UserDash from '../DashboardComp.jsx/UserDash';
import { Link } from 'react-router-dom';
import { getUser } from '../../Api/DashboardAPI';
import { useDasboardHook } from '../../hooks/DashboardUserContext';
import {Settings} from 'lucide-react'
import { FaUser, FaFolder, FaStar, FaCog, FaHeart } from 'react-icons/fa'
import ReviewPage from '../DashboardComp.jsx/ReviewDash';
import FavoruitesPage from '../DashboardComp.jsx/FavoruitesPage';
import ColorTubeLoader from '../../components/Style/ColorTubeLoader';

export default function Dashboard() {
  const [username, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [userResponse, setUserResponse] = useState(null);
  const [avatar,setAvatar] = useState('');
  const {user,dispatch} = useDasboardHook();
  const [loading, setLoading]  = useState(true);

  const [activeTab, setActiveTab] = useState('myListing')

  

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await getUser();
        setUserName(response.data.user.name);

        setAvatar(`${import.meta.env.VITE_BACK_END_URL}${response.data.user.imageUrl}`);
        
        setUserEmail(response.data.user.email);
        setUserResponse(response); // Store full response if needed
        dispatch({type:'GET_USER',payload:response.data.user})
      } catch (err) {
        console.log(err);
      }
      finally{
        setLoading(false);
      }
    };

    getUserDetail();
  }, []);


  // return (
  //   <Box>
  //     <Flex px={'50px'} justifyContent={'space-between'}>
  //       <Flex gap={2} alignItems={'center'}>
  //         <Avatar size={'lg'} src={avatar}/>
  //         <Heading fontSize={'24px'}>{username}</Heading>
          
  //       </Flex>

  //       {/* Pass the actual userResponse object to the Account Settings page */}
  //       <Button as={Link} to={`/acc`} bg={'white'} border={'1px solid black'} >
  //       <Settings style={{marginRight:'5px'}} />
  //         Account Setting
  //       </Button>
  //     </Flex>

  //     <Tabs mt={4} colorScheme="teal" defaultIndex={0}>
  //       <TabList bg="whiteAlpha.800"  rounded="lg">
  //         <Tab  border={'none'}>
  //           <Icon as={LuUser} mr="2" />
  //           My Listing
  //         </Tab>
  //         <Tab border={'none'}>
  //           <Icon as={LuFolder} mr="2" />
  //           Rental Listing
  //         </Tab>
  //       </TabList>

  //       <TabPanels>
  //         <TabPanel>
  //           <OwnerDash />
  //         </TabPanel>
  //         <TabPanel>
  //           <UserDash />
  //         </TabPanel>
  //       </TabPanels>
  //     </Tabs>
  //   </Box>
  // );
 



if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        {/* <Spinner size="xl" /> */}
        <ColorTubeLoader/>
      </Flex>
    );
  }

  return (
    <div className="min-h-screen  p-2 sm:p-2 xl:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar
            size={{base:'md',md:'lg'}}
            
              src={avatar || "/placeholder.svg"}
              
              alt={username}
          
            />
            <div>
            {/* <h1 className="text-[24px] font-bold text-gray-900 sm:text-[12px] lg:text-[24px]">{username}</h1> */}
            <Heading fontSize={{base:'12px', md:'16px', lg:'24px'}}>{username}</Heading>
            <Text fontSize={{base:'10px', md:'14px', lg:'18px'}}>{useremail}</Text>
          
            </div>
          </div>
          <Link to="/acc">
            <div className="flex items-center px-4 sm:px-2 lg:px-4 py-2
             bg-white text-orange-600 rounded-md border border-orange-600 hover:bg-orange-100 transition duration-300">
              <FaCog className="mr-2"/>
             <Text fontSize={{base:'12px', md:'14px', lg:'16px'}}>Account Settings</Text> 
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b text-[10px] sm:text-[12px] xl-text-[20px]">
            <button
              className={`flex items-center px-4 sm:px-4 lg:px-6 py-3 text-gray-700 hover:bg-orange-100 focus:outline-none ${
                activeTab === 'myListing' ? 'border-b-2 border-orange-500' : ''
              }`}
              onClick={() => setActiveTab('myListing')}
            >
              <FaUser className="mr-2" />
              My Listing
            </button>
            <button
              className={`flex items-center px-4 sm:px-4 lg:px-6 py-3 text-gray-700 hover:bg-orange-100 focus:outline-none ${
                activeTab === 'rentalListing' ? 'border-b-2 border-orange-500' : ''
              }`}
              onClick={() => setActiveTab('rentalListing')}
            >
              <FaFolder className="mr-2" />
              Rental Listing
            </button>
            <button
              className={`flex items-center  px-4 sm:px-4 lg:px-6 py-3 text-gray-700 hover:bg-orange-100 focus:outline-none ${
                activeTab === 'reviews' ? 'border-b-2 border-orange-500' : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              <FaStar className="mr-2" />
              Reviews
            </button>
            <button
              className={`flex items-center  px-4 sm:px-4 lg:px-6 py-3 text-gray-700 hover:bg-orange-100 focus:outline-none ${
                activeTab === 'Favoruites' ? 'border-b-2 border-orange-500' : ''
              }`}
              onClick={() => setActiveTab('Favoruites')}
            >
              <FaHeart className="mr-2" />
              Favoruites
            </button>
          </div>

          <div className="p-3 sm:p-3 xl:p-6">
            {activeTab === 'myListing' && <OwnerDash />}
            {activeTab === 'rentalListing' && <UserDash />}
            {activeTab === 'reviews' && <ReviewPage/>}
            {activeTab === 'Favoruites' && <FavoruitesPage/>}
          </div>
        </div>
      </div>
    </div>
  )
}
