import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { ArrowLeft, FileWarning } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CarAgreement from './Car/CarAgreement';
import HostelAgreement from './Hostel/HostelAgreement';
import HouseAgreement from './House/HouseAgreement';

const agreementForms = {
  car: CarAgreement,
  house: HouseAgreement,
  hostel: HostelAgreement,
};

export default function AgreementTemplate() {
  const location = useLocation();
  const { listId, list_Title, list_category, tenant, convoID } = location.state || {};
  const AgreementForm = agreementForms[String(list_category || '').toLowerCase()];
  const hasRequiredContext = Boolean(AgreementForm && listId && list_Title && tenant?._id && convoID);

  if (!hasRequiredContext) {
    return (
      <Flex minH="calc(100vh - 80px)" bg="#f6f7f9" px={4} py={10} align="center" justify="center">
        <Box maxW="520px" w="full" bg="white" borderWidth="1px" borderColor="gray.200" rounded="2xl" p={{ base: 6, md: 8 }} textAlign="center">
          <Flex mx="auto" w="64px" h="64px" align="center" justify="center" rounded="2xl" bg="orange.50" color="orange.600"><FileWarning size={28} /></Flex>
          <Heading size="md" mt={5}>Start the agreement from a conversation</Heading>
          <Text color="gray.500" fontSize="sm" lineHeight={1.7} mt={3}>For security, an agreement must be connected to an available listing and the renter in its message thread.</Text>
          <Button as={Link} to="/chat" mt={6} bg="#24594b" color="white" _hover={{ bg: '#1b453a' }} leftIcon={<ArrowLeft size={16} />}>Return to messages</Button>
        </Box>
      </Flex>
    );
  }

  return <AgreementForm convoID={convoID} tenant={tenant} listId={listId} list_Title={list_Title} list_category={list_category} />;
}
