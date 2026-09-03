import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GetAggreementsByID } from '../../../Api/Agreement';
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
import PopOverRenterConfirm from './PopOverRenterConfirm';
import ColorTubeLoader from '../../../components/Style/ColorTubeLoader';

export default function ViewCarAgr() {

    const {user} = useAuth();
    const [ownerConfirmed, setOwnerConfirmed] = useState(true); //done
    const [renterConfirmed, setRenterConfirmed] = useState(false); //done
    const [renterDetails, setRenterDetails] = useState(""); // done
    const [ownerDetail, setOwnerDetail] = useState(""); // done
    const [popOver, SetPopOver ] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listName, setListName] = useState('');

     const [formData, setFormData] = useState({
        createdDate: '',
        startDate: '',
        endDate: '',
        advanceRent: '',
        advanceRentMonths: '',
        securityDeposit: '',
        securityDepositMonths: '',
        rentIncreasePercentage: '',
        registrationNum:'',
        make:'',
        carModel:'',
        engineNum:'',
        ChassisNum:'',
        RentAmount:'',
        rentTime:'',
        installments:'',
        crossedChequeAmount:'',
        oilChangeTime:'',
        tuningTime:'',
        meetingOwnerDate:'',
        noticePeriod:'',
        agreementPoints: []
      });



    const {_id} = useParams();

    useEffect(() => {
          const fetchSingleAgreement = async () => {
            try {
    
              if (!_id) {
                return;
              }
      
    
              const response = await GetAggreementsByID(_id);
              setListName(response?.data?.data?.listingId?.title)
    
              const aggrDetail =
                response.data?.data?.agreementDetailsId?.aggrementDetail;
              setFormData({
                ...formData,
       createdDate:aggrDetail.createdDate ,
      startDate: aggrDetail.startDate,
      endDate: aggrDetail.endDate,
      advanceRent: aggrDetail.advanceRent,
      advanceRentMonths: aggrDetail.advanceRentMonths,
      securityDeposit: aggrDetail.securityDeposit,
      securityDepositMonths: aggrDetail.securityDepositMonths,
      rentIncreasePercentage: aggrDetail.rentIncreasePercentage,
      registrationNum:aggrDetail.registrationNum,
      make:aggrDetail.make,
      carModel:aggrDetail.carModel,
      engineNum:aggrDetail.engineNum,
      ChassisNum:aggrDetail.ChassisNum,
      RentAmount:aggrDetail.RentAmount,
      rentTime:aggrDetail.rentTime,
      installments:aggrDetail.aggrDetail,
      crossedChequeAmount:aggrDetail.crossedChequeAmount,
      oilChangeTime:aggrDetail.oilChangeTime,
      tuningTime:aggrDetail.tuningTime,
      meetingOwnerDate:aggrDetail.meetingOwnerDate,
      noticePeriod:aggrDetail.noticePeriod,
      agreementPoints: Array.isArray(aggrDetail.agreementPoints)
      ? aggrDetail.agreementPoints.map((point) => ({
          ...point, 
      
        }))
      : [],
   });
   
              setRenterDetails(response.data.data.renterId);
              setOwnerDetail(response.data.data.ownerId);
      
            setOwnerConfirmed(response.data?.data?.ownerConfirmed);
              setRenterConfirmed(response.data?.data?.renterConfirmed);
                  } catch (error) {
              console.log("errr", error);
            }
            finally{
              setLoading(false);
            }
          };
          fetchSingleAgreement();
        }, [_id, user]);


        const SetRenterStatus=()=>{
            setRenterConfirmed(prev => !prev)
            SetPopOver(true);
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
          
           <Text>
             This rent agreement is being created, on this day of
             <Input
             isDisabled    
             type="date"
               name="createdDate"
               value={formData.createdDate}
               display="inline-block"
               w="40"
               mx={2}
             />
             date.
           </Text>
   
           <Text fontWeight="bold">BETWEEN</Text>
           {ownerDetail?.name && <Text fontWeight={'semibold'} borderBottom="1px solid gray">{ownerDetail?.name}</Text>}
           <Text>Hereinafter known as the "owner" of the one part.</Text>
   
           <Text fontWeight="bold">AND</Text>
           <Text fontWeight={'semibold'} borderBottom="1px solid gray">
             {renterDetails?.name ||''}
             </Text>
           <Text>Hereinafter known as the 'tenant' of the other part.</Text>
   
           <Text>
             Whereas the landlord confirms that he is legally competent to rent out{" "}
             <span style={{ fontWeight:'600',borderBottom:"1px solid gray"}}>{listName}</span>
           </Text>

          
   
           <Text fontWeight="bold">
             NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-
           </Text>
   
           <OrderedList spacing={2}>
             <ListItem>
               That the owner has agreed to rent out the car with the following details:
               Registration No. <Input
               isDisabled
               type="text"
               name="registrationNum"
              //  placeholder='LES-15-804'
               value={formData.registrationNum}
               
               display="inline-block"
               w="40"
               mx={2}
             />, <br/> Make:
              <Input
               isDisabled
               type="text"
                name="make"
             
                value={formData.make}
                 display="inline-block"
               w="40"
               mx={2}
             
             />
              , Model: 
              <Input
              isDisabled
               type="number"
                name="carModel"
             
               value={formData.carModel}
               
               display="inline-block"
               w="40"
               mx={2}
             />
              
               ,Engine No. 
               <Input
               isDisabled
               type="text"
                name="engineNum"
              //  placeholder='PK50D702015'
                value={formData.engineNum}
               
               display="inline-block"
               w="40"
               mx={2}
             />
   
           ,<br/> Chassis No.
           <Input
           isDisabled
               type="text"
               name="ChassisNum"
              //  placeholder='A1J310PK12458915'
               // value={formData.date}
               
               value={formData.ChassisNum}
               display="inline-block"
               w="40"
               mx={2}
             />.
             </ListItem>
             <ListItem>
               The lease period shall start from
               <Input
               isDisabled
               type="date"
               name="startDate"
               value={formData.startDate}
               
               display="inline-block"
               w="40"
               mx={2}
             />
             and terminate on
             <Input
             isDisabled
               type="date"
                name="endDate"
                value={formData.endDate}
               
               display="inline-block"
               w="40"
               mx={2}
             />.
             </ListItem>
             <ListItem>
               The lessee shall pay a 
               <Input
               isDisabled
               type="text"
                name="rentTime"
               placeholder='monthy/daily'
                value={formData.rentTime}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                rent of Rs. 
               <Input
               isDisabled
               type="number"
                name="RentAmount"
              //  placeholder='30000'
                value={formData.RentAmount}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                in 
                <Input
                isDisabled
               type="number"
               name="installments"
              //  placeholder='2'
                value={formData.installments}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                installments to the owner.
             </ListItem>
             <ListItem>
               The lessee will provide a crossed cheque of Rs.
               <Input
               isDisabled
               type="number"
               name="crossedChequeAmount"
              //  placeholder='30000'
                value={formData.crossedChequeAmount}
               
               display="inline-block"
               w="40"
               mx={2}
             /> as a security deposit, which will be
               returned upon the agreement's termination, subject to deductions for dues or damages.
             </ListItem>
             <ListItem>
               The lessee is responsible for oil changes every
               <Input
               isDisabled
               type="number"
                name="oilChangeTime"
               placeholder='5000'
                value={formData.oilChangeTime}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                km and car tuning every
                <Input
                isDisabled
               type="number"
                name="tuningTime"
              //  placeholder='10000'
               value={formData.tuningTime}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                 km at their expense.
             </ListItem>
             
            
             <ListItem>
               The lessee agrees to meet the owner along with the car on the
               <Input
               isDisabled
               type="text"
                name="meetingOwnerDate"
              //  placeholder='20th'
                value={formData.meetingOwnerDate}
               
               display="inline-block"
               w="40"
               mx={2}
             />
                of each month for inspection.
             </ListItem>
             
             <ListItem>
               The lessee shall serve a
               <Input
               isDisabled
               type="number"
                name="noticePeriod"
              //  placeholder='2'
                value={formData.noticePeriod}
               
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
                   <Text color={'green.600'} fontWeight={'bold'} fontSize={'lg'}>{`${ownerDetail?.name} confirmed this agreement` }</Text>
               ) : (
                   <Text color={'red.600'} fontWeight={'bold'} fontSize={'lg'}>{`${ownerDetail?.name} not confirmed this agreement` }</Text>
               )
           }
           
           <Flex gap={4} mt={4} flexDir={'column'} >
       
           { 
               renterConfirmed ? (
                   <Text color={'green.600'} fontWeight={'bold'} fontSize={'lg'}>{`${renterDetails?.name} confirmed this agreement` }</Text>
               ) : (
                   <Text color={'red.600'} fontWeight={'bold'} fontSize={'lg'}>{`${renterDetails?.name} not confirmed this agreement` }</Text>
               )
           }

           {  renterDetails?._id === user?._id && !renterConfirmed && (
            <Button w={'fit-content'} onClick={SetRenterStatus }  bg={'black'} color={'white'}>
            {
                renterConfirmed ? (<Text>I dont agree to this agreemnt</Text>) : (<Text>I agree to this agreement</Text>)
            }
        </Button>

           )}

                   
   {
   renterDetails?._id === user?._id && renterConfirmed && popOver && ( <PopOverRenterConfirm aggId={_id} renterConfirmed={renterConfirmed} setRenterConfirmed={setRenterConfirmed} /> )
   }

           </Flex>
   
        
         </VStack>
       </Box>
         
       </div>
  )
}
