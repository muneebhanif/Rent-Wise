// just a template to create and update agreements , not functionality

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Input,
  Text,
  VStack,
  ListItem,
  OrderedList,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import SendToTenant from '../SendToTenant';
import ColorTubeLoader from '../../../components/Style/ColorTubeLoader';

export default function HostelAgrTemplate({
  updateAgreement,
  mainDetails,
  formData,
  handleChange,
  saveAgreement,
  tenant,
  checkCreateAgrr,
  OwnerConfirmedFunc,
  ownerConfirmed,
  list_Title
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const [loading, setLoading] = useState(true);
  const [renterConfirmed, setRenterConfirmed] = useState(false);

  useEffect(() => {
    setRenterConfirmed(mainDetails?.renterConfirmed);
    setLoading(false);
  }, [mainDetails]);

  function sendAggrToRenter() {
    setIsOpen(!isOpen);
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <ColorTubeLoader />
      </Flex>
    );
  }

  return (
    <div>
      <Box maxW="4xl" mx="auto" p={6} bg="white" boxShadow="lg" borderRadius="lg">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Hostel Rental Agreement
        </Heading>
        <VStack spacing={4} align="start" fontSize="sm">
          <form onSubmit={saveAgreement}>
            <Text>
              This rent agreement is being created, on this day of
              <Input
                type="date"
                name="createdDate"
                value={formData.createdDate}
                onChange={handleChange}
                display="inline-block"
                w="40"
                mx={2}
              />
              date.
            </Text>

            <Text fontWeight="bold">BETWEEN</Text>
            {user && (
              <Text borderBottom={'1px solid gray'}>{user.name}</Text>
            )}
            <Text>Hereinafter known as the "landlord" of the one part.</Text>

            <Text fontWeight="bold">AND</Text>
            <Text borderBottom={'1px solid gray'}>
              {tenant.name || ''}
            </Text>
            <Text>Hereinafter known as the 'tenant' of the other part.</Text>

            <Text>
            Whereas the landlord confirms that he is legally competent to rent out{' '}
            {list_Title || mainDetails && (
             <Text fontWeight={'bold'} as="span" borderBottom="1px solid black">
                 {list_Title || mainDetails?.listingId?.title}
                </Text>
            )}{' '}
            with necessary electrical fittings and fixtures therein. The landlord has agreed to rent and the other party has agreed to accept the rent of said hostel room.
            </Text>


            <Text fontWeight="bold">NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-</Text>

            <OrderedList spacing={2}>
              <ListItem>
                That the payment due each month for the hostel room will be Rs.
                <Input
                  type="number"
                  name="rentAmount"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  display="inline-block"
                  w="32"
                  mx={2}
                />
                .
              </ListItem>
              <ListItem>
                That the duration for the contract shall be
                <Input
                  type="number"
                  name="duration"
                  placeholder={'12'}
                  value={formData.duration}
                  onChange={handleChange}
                  display="inline-block"
                  w="32"
                  mx={2}
                />
                <Input
                  type="text"
                  placeholder={'days/week/month'}
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleChange}
                  display="inline-block"
                  w="32"
                  mx={2}
                /> The agreement shall initiate from
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  display="inline-block"
                  w="40"
                  mx={2}
                />
                and expire on
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  display="inline-block"
                  w="40"
                  mx={2}
                />
                .
              </ListItem>
              <ListItem>
                That the hostel room will not be sublet and will not be used for illegal activities or any other reason but 'Residential" use only.
              </ListItem>
              <ListItem>
                That the Landlord has received from the tenant a sum of Rs.
                <Input
                  type="number"
                  name="advanceRent"
                  value={formData.advanceRent}
                  onChange={handleChange}
                  display="inline-block"
                  w="32"
                  mx={2}
                />
                being the
                <Input
                  type="number"
                  name="advanceRentMonths"
                  placeholder='3'
                  value={formData.advanceRentMonths}
                  onChange={handleChange}
                  display="inline-block"
                  w="20"
                  mx={2}
                />
                month's advance rent and Rs.
                <Input
                  type="number"
                  name="securityDeposit"
                  placeholder='40000'
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  display="inline-block"
                  w="32"
                  mx={2}
                />
                being the
                <Input
                  type="number"
                  name="securityDepositMonths"
                  placeholder='3'
                  value={formData.securityDepositMonths}
                  onChange={handleChange}
                  display="inline-block"
                  w="20"
                  mx={2}
                />
                month's Security Fixed Deposit.
              </ListItem>
              <ListItem>
                That the Tenant will submit the monthly due rent to the homeowner/Landlord on or before the date
                <Input
                  type="number"
                  name="monthlyDueDate"
                  placeholder='5'
                  value={formData.monthlyDueDate}
                  onChange={handleChange}
                  display="inline-block"
                  w="20"
                  mx={2}
                />
                of every calendar month till the expiry of the rent agreement.
              </ListItem>
              <ListItem>
                That both parties involved in the agreement have decided to increase
                <Input
                  type="number"
                  name="rentIncreasePercentage"
                  value={formData.rentIncreasePercentage}
                  onChange={handleChange}
                  display="inline-block"
                  w="20"
                  mx={2}
                />
                % rent every year.
              </ListItem>
              {formData?.agreementPoints?.map((point, index) => (
                <ListItem key={point.id}>
                  <Text>{point.text}</Text>
                </ListItem>
              ))}
            </OrderedList>

            <Text>
              In witness whereof, the parties named above have ascribed their hands hereto legitimise this agreement and the date mentioned
            </Text>

            {ownerConfirmed ? (
              <Text color={'green.600'} fontWeight={'bold'} fontSize={'lg'}>{`${user?.name} confirmed this agreement`}</Text>
            ) : (
              <Text color={'red.600'} fontWeight={'bold'} fontSize={'lg'}>{`${user?.name} not confirmed this agreement`}</Text>
            )}

            <Flex gap={4} mt={4}>
              {!checkCreateAgrr && (
                <Button type='submit' bg={'black'} color={'white'}>Create Agreement</Button>
              )}

              {checkCreateAgrr && (
                <>
                  {ownerConfirmed && !renterConfirmed && (
                    <Button bg={'black'} onClick={updateAgreement} color={'white'}>Update Agreement</Button>
                  )}

                  {!renterConfirmed && (
                    <Button onClick={OwnerConfirmedFunc} bg={'black'} color={'white'}>
                      {ownerConfirmed ? (
                        <Text>I don't agree to this agreement</Text>
                      ) : (
                        <Text>I agree to this agreement</Text>
                      )}
                    </Button>
                  )}
                </>
              )}

              {checkCreateAgrr && ownerConfirmed && (
                <Button bg={'black'} onClick={sendAggrToRenter} color={'white'}>Send Agreement To Renter</Button>
              )}
            </Flex>

            {isOpen && (
              <Box display={'flex'} justifyContent={'center'}>
                <SendToTenant
                  mainDetails={mainDetails}
                  setIsOpen={setIsOpen}
                  open={open}
                  close={close}
                  isOpen={isOpen}
                />
              </Box>
            )}
          </form>
        </VStack>
      </Box>
    </div>
  );
}
