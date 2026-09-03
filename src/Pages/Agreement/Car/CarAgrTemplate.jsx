// just a template to create and update agreements , not functionlaity

import React, { useEffect, useState } from 'react'
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


export default function CarAgrTemplate({updateAgreement,mainDetails,formData, handleChange, saveAgreement,tenant
    , checkCreateAgrr, OwnerConfirmedFunc, ownerConfirmed,list_Title }) {
    const {user} = useAuth();
    const [renterConfirmed, setRenterConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = React.useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
      useEffect(()=>{
             setRenterConfirmed(mainDetails?.renterConfirmed)
             setLoading(false);
                      
            },[mainDetails])
  
            function sendAggrToRenter(){
              // navigate('/sendToTenant',
              //   {
              //     state: {mainDetails }
              //   })
              setIsOpen(!isOpen)
            }

    if (loading) {
         return (
           <Flex justify="center" align="center" height="100vh">
             {/* <Spinner size="xl" /> */}
             <ColorTubeLoader/>
           </Flex>
         );
       }         
 
  return (
    <div>
        <Box maxW="4xl" mx="auto" p={6} bg="white" boxShadow="lg" borderRadius="lg">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Car Rental Agreement
      </Heading>
      <VStack spacing={4} align="start" fontSize="sm">
        <form  onSubmit={saveAgreement}>
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
        {user && <Text borderBottom="1px solid gray">{user.name}</Text>}
        <Text>Hereinafter known as the "owner" of the one part.</Text>

        <Text fontWeight="bold">AND</Text>
        <Text borderBottom="1px solid gray">
          {tenant.name ||''}
          </Text>
        <Text>Hereinafter known as the 'tenant' of the other part.</Text>

        <Text>
          Whereas the landlord confirms that he is legally competent to rent out{' '}
         {list_Title || mainDetails && (
                      <Text fontWeight={'bold'} as="span" borderBottom="1px solid black">
                          {list_Title || mainDetails?.listingId?.title}
                         </Text>
                     )}{' '}
        </Text>

        <Text fontWeight="bold">
          NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-
        </Text>

        <OrderedList spacing={2}>
          <ListItem>
            That the owner has agreed to rent out the car with the following details:
            Registration No. <Input
            type="text"
            name="registrationNum"
            placeholder='LES-15-804'
            value={formData.registrationNum}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />, <br/> Make:
           <Input
            type="text"
             name="make"
            placeholder='Suzuki / Wagon R'
             value={formData.make}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
           , Model: 
           <Input
            type="number"
             name="carModel"
            placeholder='2015'
            value={formData.carModel}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
           
            ,Engine No. 
            <Input
            type="text"
             name="engineNum"
            placeholder='PK50D702015'
             value={formData.engineNum}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />

        ,<br/> Chassis No.
        <Input
            type="text"
            name="ChassisNum"
            placeholder='A1J310PK12458915'
            // value={formData.date}
            onChange={handleChange}
            value={formData.ChassisNum}
            display="inline-block"
            w="40"
            mx={2}
          />.
          </ListItem>
          <ListItem>
            The lease period shall start from
            <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
          and terminate on
          <Input
            type="date"
             name="endDate"
             value={formData.endDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />.
          </ListItem>
          <ListItem>
            The lessee shall pay a 
            <Input
            type="text"
             name="rentTime"
            placeholder='monthy/daily'
             value={formData.rentTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             rent of Rs. 
            <Input
            type="number"
             name="RentAmount"
            placeholder='30000'
             value={formData.RentAmount}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             in 
             <Input
            type="number"
            name="installments"
            placeholder='2'
             value={formData.installments}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             installments to the owner.
          </ListItem>
          <ListItem>
            The lessee will provide a crossed cheque of Rs.
            <Input
            type="number"
            name="crossedChequeAmount"
            placeholder='30000'
             value={formData.crossedChequeAmount}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          /> as a security deposit, which will be
            returned upon the agreement's termination, subject to deductions for dues or damages.
          </ListItem>
          <ListItem>
            The lessee is responsible for oil changes every
            <Input
            type="number"
             name="oilChangeTime"
            placeholder='5000'
             value={formData.oilChangeTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             km and car tuning every
             <Input
            type="number"
             name="tuningTime"
            placeholder='10000'
            value={formData.tuningTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
              km at their expense.
          </ListItem>
          
         
          <ListItem>
            The lessee agrees to meet the owner along with the car on the
            <Input
            type="text"
             name="meetingOwnerDate"
            placeholder='20th'
             value={formData.meetingOwnerDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             of each month for inspection.
          </ListItem>
          
          <ListItem>
            The lessee shall serve a
            <Input
            type="number"
             name="noticePeriod"
            placeholder='2'
             value={formData.noticePeriod}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             week notice period to terminating the agreement or pay rent for the shortfall
            in the notice period.
          </ListItem>


          {formData?.agreementPoints?.map((point, index) => (
                    <ListItem key={point.id}>
                      <Text>{point.text}</Text>
                    </ListItem>
                  ))}

        </OrderedList>

        <Text>
          In witness whereof, the parties named above have ascribed their hands hereto legitimise this agreement
          at the date mentioned.
        </Text>

        {
            ownerConfirmed ? (
                <Text color={'green.600'} fontWeight={'bold'} fontSize={'lg'}>{`${user?.name} confirmed this agreement` }</Text>
            ) : (
                <Text color={'red.600'} fontWeight={'bold'} fontSize={'lg'}>{`${user?.name} not confirmed this agreement` }</Text>
            )
        }
        
        <Flex gap={4} mt={4} >
            {
                !checkCreateAgrr && (
                    <Button type='submit' bg={'black'} color={'white'}>Create Agreement</Button>
                )
            }
    
        {
            checkCreateAgrr && (
                <>
               { ownerConfirmed && !renterConfirmed &&
                (  <Button  bg={'black'} onClick={updateAgreement} color={'white'}>Update Agreement</Button> )
               }
               
               {
                !renterConfirmed && (
                  <Button onClick={OwnerConfirmedFunc}  bg={'black'} color={'white'}>
                    {
                        ownerConfirmed ? (<Text>I dont agree to this agreemnt</Text>) : (<Text>I agree to this agreement</Text>)
                    }
                </Button>

                )
               }
                
                </>
            )
        }
        {
            checkCreateAgrr && ownerConfirmed && (
                <Button onClick={sendAggrToRenter}  bg={'black'} color={'white'}>Send Agreement To Renter</Button>
                
            )
        }
         {
            isOpen && ( <Box display={'flex'} justifyContent={'center'}> <SendToTenant mainDetails={mainDetails} setIsOpen={setIsOpen} open={open} close={close} isOpen={isOpen}   /> </Box>)
         }
        </Flex>
        

        </form>
      </VStack>
    </Box>
      
    </div>
  )
}
