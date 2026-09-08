import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FilePlus2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
export default function UserPopover({ tenant, convoID, listings = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const available = listings.filter(listing => String(listing?.owner?._id || listing?.owner) === String(user?._id || user?.id) && listing.rentalState === 'available');
  if (!available.length || !convoID) return null;
  return <Menu><MenuButton as={Button} size="sm" variant="outline" colorScheme="teal" leftIcon={<FilePlus2 size={16} />}>Agreement</MenuButton><MenuList>{available.map(listing => <MenuItem key={listing._id} onClick={() => navigate('/agreement', { state: { listId: listing._id, list_Title: listing.title, list_category: listing.category, tenant, convoID } })}>{listing.title}</MenuItem>)}</MenuList></Menu>;
}
