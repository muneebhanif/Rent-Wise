
import { useEffect, useState } from "react"
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Container, Heading } from "@chakra-ui/react"
import { getAggrementForAdminByOwnerIDs } from "../../../Api/Blockchain";
import Integration from "./Integration";
import { useAgreement } from "../../../hooks/AdminAgreementContext";

export default function DisplayAgreements() {
  const [agreements, setAgreements] = useState([]);
  const { deployAgreement, showIntegration, selectedAgreementId } = useAgreement();
   const [agreementDetails, setAgreementDetails] = useState(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await getAggrementForAdminByOwnerIDs();
        setAgreements(response?.data?.data);
      } catch (error) {
        console.error("Error fetching agreements:", error)
      }
    }

    fetchAgreements()
  }, [agreementDetails])

  return (
    <Container maxW="container.lg" py={10}>
      <Box overflowX="auto">
        <Heading color={'blue.500'} mb={10}>Non Blockchain Agreements</Heading>
        <Table variant="striped" mb={'20px'}>
          <Thead>
            <Tr bg={'gray.300'}>
              <Th>Agreement ID</Th>
              <Th>Blockchain Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {agreements.map((agreement) => (
              <Tr key={agreement._id}>
                <Td>{agreement._id}</Td>
                <Td>
                  {agreement.blockchainStatus ? "On Blockchain Already" : "Not on Blockchain"}
                </Td>
                <Td>
                  <Button colorScheme="blue" onClick={() => deployAgreement(agreement._id)}>
                    Deploy on Blockchain
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {showIntegration && selectedAgreementId && (
          <Integration agreementId={selectedAgreementId} agreementDetails={agreementDetails}  setAgreementDetails={setAgreementDetails} />
        )}
      </Box>
    </Container>
  );
}
