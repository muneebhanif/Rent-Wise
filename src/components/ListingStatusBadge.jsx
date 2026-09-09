/* eslint-disable react/prop-types */
import { Badge, Flex } from '@chakra-ui/react';
import { CheckCircle2, Clock3, LockKeyhole } from 'lucide-react';

const status = {
  available: { label: 'Available', color: 'green', icon: CheckCircle2 },
  rented: { label: 'Rented', color: 'red', icon: LockKeyhole },
  pending: { label: 'Agreement Pending', color: 'orange', icon: Clock3 },
  upcoming: { label: 'Rented', color: 'red', icon: LockKeyhole },
  cancellation_requested: { label: 'Rented', color: 'red', icon: LockKeyhole },
};

export default function ListingStatusBadge({ state, showAvailable = false, ...positionProps }) {
  const details = status[state];
  if (!details || ((state === 'available' || state === 'pending') && !showAvailable)) return null;
  const Icon = details.icon;

  return (
    <Badge
      colorScheme={details.color}
      bg={`${details.color}.600`}
      color="white"
      rounded="full"
      px={3}
      py={1.5}
      textTransform="uppercase"
      letterSpacing="0.8px"
      fontSize="10px"
      boxShadow="0 4px 14px rgba(0, 0, 0, 0.16)"
      zIndex={2}
      {...positionProps}
    >
      <Flex align="center" gap={1.5}>
        <Icon size={12} strokeWidth={2.5} />
        {details.label}
      </Flex>
    </Badge>
  );
}
