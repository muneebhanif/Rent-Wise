import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert, AlertIcon, Avatar, Box, Button, Divider, Flex, FormControl,
  FormHelperText, FormLabel, Grid, Heading, Input, Spinner, Switch,
  Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useToast, VStack,
} from '@chakra-ui/react';
import { ArrowLeft, BellRing, Camera, LockKeyhole, Save, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUser, updateUserDashboardProfile } from '../../Api/DashboardAPI';
import { useAuth } from '../../hooks/AuthContext';
import { useDasboardHook } from '../../hooks/DashboardUserContext';
import { chatMediaUrl } from '../Conversation/chatMedia';

const defaultNotifications = { review: true, comment: true, system: true, aggreement: true, chat: true };
const notificationRows = [
  ['chat', 'Messages', 'New messages in your rental conversations'],
  ['aggreement', 'Agreements', 'Agreement requests, confirmations, and updates'],
  ['comment', 'Listing comments', 'Questions and comments on your listings'],
  ['review', 'Reviews', 'New reviews from other RentWise members'],
  ['system', 'Product updates', 'Important account and platform announcements'],
];

export default function MyAccount() {
  const toast = useToast();
  const { user, dispatch } = useDasboardHook();
  const { fetchUserData } = useAuth();
  const initialProfile = useRef(null);
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [isThirdPartyUser, setIsThirdPartyUser] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await getUser();
      const nextUser = response.data?.user;
      if (!nextUser?._id) throw new Error('Your account details were not returned.');
      const nextProfile = { name: nextUser.name || '', email: nextUser.email || '', bio: nextUser.bio || '' };
      const nextNotifications = { ...defaultNotifications, ...(nextUser.NotificationSetting?.notificationPreferences || {}) };
      initialProfile.current = { profile: nextProfile, notifications: nextNotifications };
      setProfile(nextProfile);
      setNotifications(nextNotifications);
      setAvatarUrl(chatMediaUrl(nextUser.imageUrl));
      setIsThirdPartyUser(Boolean(nextUser.googleId || nextUser.facebookId));
      dispatch({ type: 'GET_USER', payload: nextUser });
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message || 'We could not load your account settings.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); }, [avatarPreview]);

  const changeProfile = field => event => setProfile(previous => ({ ...previous, [field]: event.target.value }));
  const changePassword = field => event => setPasswords(previous => ({ ...previous, [field]: event.target.value }));
  const selectAvatar = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Choose an image file', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image is too large', description: 'Choose an image smaller than 5 MB.', status: 'error', duration: 4000, isClosable: true });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const resetChanges = () => {
    if (initialProfile.current) {
      setProfile(initialProfile.current.profile);
      setNotifications(initialProfile.current.notifications);
    }
    setPasswords({ current: '', next: '', confirm: '' });
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const saveChanges = async () => {
    const name = profile.name.trim();
    const email = profile.email.trim();
    if (!name || !email) {
      toast({ title: 'Name and email are required', status: 'error', duration: 3500, isClosable: true });
      return;
    }
    if (passwords.next && passwords.next.length < 8) {
      toast({ title: 'Use at least 8 characters for your new password', status: 'error', duration: 4000, isClosable: true });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast({ title: 'New passwords do not match', status: 'error', duration: 3500, isClosable: true });
      return;
    }
    if (passwords.next && !passwords.current) {
      toast({ title: 'Enter your current password first', status: 'error', duration: 3500, isClosable: true });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', profile.bio.trim());
    formData.append('notificationPreferences', JSON.stringify(notifications));
    if (avatarFile) formData.append('avatar', avatarFile);
    if (passwords.next) {
      formData.append('currentPassword', passwords.current);
      formData.append('password', passwords.next);
    }

    setSaving(true);
    try {
      const response = await updateUserDashboardProfile(user._id, formData);
      const updatedUser = response.data?.user;
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      initialProfile.current = { profile: { ...profile, name, email, bio: profile.bio.trim() }, notifications: { ...notifications } };
      setProfile(initialProfile.current.profile);
      setPasswords({ current: '', next: '', confirm: '' });
      setAvatarFile(null);
      setAvatarPreview('');
      setAvatarUrl(chatMediaUrl(updatedUser?.imageUrl));
      await fetchUserData(true);
      toast({ title: 'Account settings saved', description: 'Your changes are now up to date.', status: 'success', duration: 3500, isClosable: true });
    } catch (error) {
      toast({ title: 'Could not save your changes', description: error.response?.data?.message || 'Please check your details and try again.', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Flex minH="calc(100vh - 80px)" align="center" justify="center" bg="#f6f7f9"><Spinner size="lg" color="#24594b" thickness="3px" aria-label="Loading account settings" /></Flex>;

  return (
    <Box as="main" minH="calc(100vh - 80px)" bg="#f6f7f9" px={{ base: 4, md: 7 }} py={{ base: 6, md: 9 }} color="gray.800">
      <Box maxW="1120px" mx="auto">
        <Button as={Link} to="/dashboard" variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} mb={4}>Back to dashboard</Button>
        <Flex justify="space-between" align={{ base: 'start', md: 'end' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={7}>
          <Box><Text fontSize="10px" fontWeight="bold" color="gray.500" letterSpacing="1.7px">YOUR ACCOUNT</Text><Heading mt={1} fontSize={{ base: '28px', md: '34px' }} letterSpacing="-1px">Account settings</Heading><Text mt={2} color="gray.500" fontSize="sm">Manage your profile, notifications, and sign-in security.</Text></Box>
          <Flex gap={2} w={{ base: 'full', md: 'auto' }}><Button flex={{ base: 1, md: 'initial' }} variant="outline" bg="white" onClick={resetChanges} isDisabled={saving}>Discard</Button><Button flex={{ base: 1, md: 'initial' }} bg="#24594b" color="white" _hover={{ bg: '#1b453a' }} leftIcon={<Save size={16} />} onClick={saveChanges} isLoading={saving} loadingText="Saving">Save changes</Button></Flex>
        </Flex>

        {loadError ? <Alert status="error" rounded="xl"><AlertIcon /><Box flex="1"><Text fontWeight="semibold">Account settings unavailable</Text><Text fontSize="sm">{loadError}</Text></Box><Button size="sm" onClick={loadProfile}>Retry</Button></Alert> : (
          <Grid templateColumns={{ base: '1fr', lg: '280px minmax(0, 1fr)' }} gap={6} alignItems="start">
            <Box bg="#173d34" color="white" rounded="2xl" p={6} position={{ lg: 'sticky' }} top={{ lg: 24 }}>
              <Flex direction="column" align="center" textAlign="center">
                <Box position="relative"><Avatar size="2xl" name={profile.name} src={avatarPreview || avatarUrl} bg="orange.100" color="orange.800" border="4px solid" borderColor="whiteAlpha.300" /><Button as="label" htmlFor="avatar-upload" position="absolute" right={-2} bottom={0} minW={0} w="38px" h="38px" p={0} rounded="full" bg="orange.400" color="#173d34" cursor="pointer" _hover={{ bg: 'orange.300' }} aria-label="Change profile photo"><Camera size={17} /></Button><Input id="avatar-upload" type="file" accept="image/png,image/jpeg,image/webp" display="none" onChange={selectAvatar} /></Box>
                <Heading size="md" mt={5} noOfLines={1}>{profile.name || 'RentWise member'}</Heading><Text fontSize="sm" color="whiteAlpha.700" mt={1} noOfLines={1}>{profile.email}</Text>
                <Divider my={5} borderColor="whiteAlpha.300" />
                <Flex gap={2} align="center" color="whiteAlpha.800"><ShieldCheck size={16} /><Text fontSize="xs">Your profile details are private and secure.</Text></Flex>
              </Flex>
            </Box>

            <Box bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" overflow="hidden">
              <Tabs colorScheme="teal" variant="unstyled" isLazy>
                <TabList px={{ base: 3, md: 6 }} pt={3} borderBottomWidth="1px" borderColor="gray.100" overflowX="auto">
                  <Tab gap={2} flexShrink={0} px={3} py={4} fontSize="sm" color="gray.500" borderBottomWidth="2px" borderColor="transparent" _selected={{ color: '#24594b', borderColor: '#24594b' }}><UserRound size={16} />Profile</Tab>
                  <Tab gap={2} flexShrink={0} px={3} py={4} fontSize="sm" color="gray.500" borderBottomWidth="2px" borderColor="transparent" _selected={{ color: '#24594b', borderColor: '#24594b' }}><BellRing size={16} />Notifications</Tab>
                  {!isThirdPartyUser && <Tab gap={2} flexShrink={0} px={3} py={4} fontSize="sm" color="gray.500" borderBottomWidth="2px" borderColor="transparent" _selected={{ color: '#24594b', borderColor: '#24594b' }}><LockKeyhole size={16} />Security</Tab>}
                </TabList>
                <TabPanels>
                  <TabPanel p={{ base: 5, md: 7 }}><Heading size="sm">Personal information</Heading><Text mt={1} mb={6} color="gray.500" fontSize="sm">This information appears on your RentWise profile.</Text><VStack spacing={5} align="stretch"><FormControl isRequired><FormLabel fontSize="sm">Full name</FormLabel><Input value={profile.name} onChange={changeProfile('name')} autoComplete="name" rounded="lg" /></FormControl><FormControl isRequired><FormLabel fontSize="sm">Email address</FormLabel><Input value={profile.email} onChange={changeProfile('email')} type="email" autoComplete="email" rounded="lg" /></FormControl><FormControl><Flex justify="space-between"><FormLabel fontSize="sm">About you</FormLabel><Text fontSize="xs" color="gray.400">{profile.bio.length}/500</Text></Flex><Textarea value={profile.bio} onChange={changeProfile('bio')} maxLength={500} minH="130px" resize="vertical" placeholder="Share a short introduction with renters and owners." rounded="lg" /><FormHelperText>Keep it friendly and avoid sharing private contact information.</FormHelperText></FormControl></VStack></TabPanel>
                  <TabPanel p={{ base: 5, md: 7 }}><Heading size="sm">Notification preferences</Heading><Text mt={1} mb={4} color="gray.500" fontSize="sm">Choose the updates you want to receive.</Text><VStack align="stretch" spacing={0}>{notificationRows.map(([key, title, description], index) => <Flex key={key} py={5} gap={4} align="center" borderTopWidth={index ? '1px' : 0} borderColor="gray.100"><Box flex="1"><Text fontWeight="semibold" fontSize="sm">{title}</Text><Text color="gray.500" fontSize="xs" mt={1}>{description}</Text></Box><Switch aria-label={`${title} notifications`} colorScheme="teal" isChecked={notifications[key]} onChange={() => setNotifications(previous => ({ ...previous, [key]: !previous[key] }))} /></Flex>)}</VStack></TabPanel>
                  {!isThirdPartyUser && <TabPanel p={{ base: 5, md: 7 }}><Heading size="sm">Change password</Heading><Text mt={1} mb={6} color="gray.500" fontSize="sm">Use at least 8 characters and choose a password you do not use elsewhere.</Text><VStack spacing={5} align="stretch" maxW="520px"><FormControl><FormLabel fontSize="sm">Current password</FormLabel><Input type="password" value={passwords.current} onChange={changePassword('current')} autoComplete="current-password" rounded="lg" /></FormControl><FormControl><FormLabel fontSize="sm">New password</FormLabel><Input type="password" value={passwords.next} onChange={changePassword('next')} autoComplete="new-password" rounded="lg" /></FormControl><FormControl isInvalid={Boolean(passwords.confirm && passwords.next !== passwords.confirm)}><FormLabel fontSize="sm">Confirm new password</FormLabel><Input type="password" value={passwords.confirm} onChange={changePassword('confirm')} autoComplete="new-password" rounded="lg" /></FormControl><Button as={Link} to="/auth/forgetPassword" alignSelf="flex-start" variant="link" color="#24594b" fontSize="sm">Forgot your password?</Button></VStack></TabPanel>}
                </TabPanels>
              </Tabs>
            </Box>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
