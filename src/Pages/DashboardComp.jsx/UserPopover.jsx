/* eslint-disable react/prop-types */
import { Button, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { FilePlus2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
export default function UserPopover({ tenant, convoID, listings = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const owned = listings.filter(listing => String(listing?.owner?._id || listing?.owner) === String(user?._id || user?.id));
  const available = owned.filter(listing => {
    const canRent = listing?.rentalState ? listing.rentalState === 'available' : listing?.listingStatus === 'active';
    return canRent;
  });
  if (!owned.length || !convoID) return null;
  if (!available.length) return <Tooltip label="This listing already has a current or pending agreement." hasArrow><Button size="sm" isDisabled leftIcon={<FilePlus2 size={16} />}>Listing unavailable</Button></Tooltip>;
  return <Menu><MenuButton as={Button} size="sm" bg="#24594b" color="white" _hover={{ bg: '#1b453a' }} _active={{ bg: '#173d34' }} leftIcon={<FilePlus2 size={16} />}>Create agreement</MenuButton><MenuList>{available.map(listing => <MenuItem key={listing._id} onClick={() => navigate('/agreement', { state: { listId: listing._id, list_Title: listing.title, list_category: listing.category, tenant, convoID } })}>{listing.title}</MenuItem>)}</MenuList></Menu>;
}
