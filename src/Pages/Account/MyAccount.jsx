import React, { useEffect, useState } from 'react'
import { 
  Box, Button, FormControl, FormLabel, Input, Switch, Tabs, TabList, TabPanels, Tab, TabPanel, Avatar, Textarea, VStack, HStack, useToast, Text,
  Flex, 
  
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'

import { useDasboardHook } from '../../hooks/DashboardUserContext';
import { getUser, updateUserDashboardProfile } from '../../Api/DashboardAPI';
import ColorTubeLoader from '../../components/Style/ColorTubeLoader';


export default function MyAccount() {
  const [avatar, setAvatar] = useState('')
  const { user, dispatch } = useDasboardHook();
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isThirdPartyUser, setIsThirdPartyUser] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    messages: false,
    reviews: false,
    systemUpdates: false,
    comments: false
  });
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const response = await getUser();
        dispatch({ type: 'GET_USER', payload: response.data.user });
        setUsername(response.data.user.name);
        setUserEmail(response.data.user.email);
        setAvatar(`${import.meta.env.VITE_BACK_END_URL}${response.data.user.imageUrl}`);
        setBio(response.data.user.bio);
        setIsThirdPartyUser(!!response.data.user.googleId || !!response.data.user.facebookId);
        if (response.data.user.NotificationSetting) {
          setNotificationSettings(response.data.user.NotificationSetting.notificationPreferences);
        }
      } catch (err) {
        console.error(err);
      }
      finally{
        setLoading(false);
      }
      
    };

    fetchUser();
  }, [dispatch]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setAvatar(file);
      
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl); 
    }
  };
  
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Passwords do not match. Enter again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }
  
    const formData = new FormData();
    formData.append('userid', user._id);
    formData.append('name', username);
    formData.append('email', userEmail);
    formData.append('bio', bio);
    formData.append('notificationPreferences', JSON.stringify(notificationSettings));

    if(currentPassword) formData.append('currentPassword', currentPassword);
    if (avatar) formData.append('avatar', avatar);  

    if (newPassword) formData.append('password', newPassword);
  
    try {
      const response = await updateUserDashboardProfile(user._id, formData);
  
      toast({
        title: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
    } catch (err) {
      console.log(err);
      toast({
        title: err.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
    
  if (loading) {
      return (
        <Flex justify="center" align="center" height="100vh">
          <ColorTubeLoader/>
        </Flex>
      );
    }

  return (
    <Box bg={'white'} maxW="3xl" mx="auto" p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Account Settings</Text>
        <Text fontSize="md" color="gray.600">Manage your account settings and set email preferences.</Text>
      </Box>
      <Tabs isFitted variant="enclosed">
        <TabList bg={'gray.50'}  mb="1em" >
          <Tab>Personal</Tab>
          <Tab>Notifications</Tab>
          {/* <Tab>Privacy</Tab> */}
          {!isThirdPartyUser && <Tab>Security</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <HStack spacing={4}>
              <Avatar size="xl" src={avatarPreview || avatar} />
                <Box>
                  <FormLabel htmlFor="avatar-upload" cursor="pointer" display="flex" alignItems="center">
                     Change Avatar
                  </FormLabel>
                  <Input id="avatar-upload" type="file" accept="image/*" display="none" onChange={handleAvatarChange} />
                </Box>
              </HStack>
              <FormControl>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input value={username} onChange={(e)=> setUsername(e.target.value)} id="name" placeholder="Enter your full name" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input value={userEmail} onChange={(e)=> setUserEmail(e.target.value)} id="email" type="email" placeholder="Enter your email" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <Textarea id="bio" placeholder="Tell us about yourself" value={bio} onChange={(e)=> setBio(e.target.value)} />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>

              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Reviews Notifications</FormLabel>
                <Switch colorScheme={'orange'} isChecked={notificationSettings.review} onChange={() => handleNotificationChange('review')} />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>System Updates</FormLabel>
                <Switch colorScheme={'orange'} isChecked={notificationSettings.system} onChange={() => handleNotificationChange('system')} />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Aggreements</FormLabel>
                <Switch colorScheme={'orange'} isChecked={notificationSettings.aggreement} onChange={() => handleNotificationChange('aggreement')} />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Comments</FormLabel>
                <Switch colorScheme={'orange'} isChecked={notificationSettings.comment} onChange={() => handleNotificationChange('comment')} />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Chats</FormLabel>
                <Switch colorScheme={'orange'} isChecked={notificationSettings.chat} onChange={() => handleNotificationChange('chat')} />
              </FormControl>
            </VStack>
          </TabPanel>

          {!isThirdPartyUser && (
            <TabPanel>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Current Password</FormLabel>
                  <Input type="password" value={currentPassword} onChange={(e)=> setCurrentPassword(e.target.value)}  />
                </FormControl>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
                </FormControl>
                <FormControl>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input type="password" value={confirmNewPassword} onChange={(e)=> setConfirmNewPassword(e.target.value)}/>
                </FormControl>
                <Text alignSelf={'flex-start'} color={'orange.500'} as={Link} to={'/auth/forgetPassword'}>Forget Password?</Text>
              </VStack>
            </TabPanel>
          )}        </TabPanels>
      </Tabs>
      <HStack justifyContent="space-between" mt={6}>
        <Button variant="outline">Cancel</Button>
        <Button variant={'customButton'} onClick={handleSaveChanges}>Save Changes</Button>
      </HStack>
    </Box>
  )
}