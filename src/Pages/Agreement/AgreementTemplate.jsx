import {
  Box,
  Card,
  Heading,
  Text,
  Divider,
  Stack,
  Input,
  Flex,
  VStack,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";


import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { createAgreement , SentAggreement } from "../../Api/Agreement";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";

import { io } from "socket.io-client";
import HouseAgreement from "./House/HouseAgreement";
import CarAgreement from "./Car/CarAgreement";
import HostelAgreement from "./Hostel/HostelAgreement";

const socket = io("http://localhost:3600");
export default function AgreementTemplate() {
  const toast = useToast();
  

  const location = useLocation();

  const { listId, list_Title , list_category, tenant, convoID } = location.state || {};


  useEffect(()=>{
    if(!convoID)
    {
      console.log('no convo id found in agreement')
    }

  },[list_category, convoID])



const SentToRenter = async () => {
 
  socket.emit("join-conversation", conversationId);

  try {
      const link = `${import.meta.env.VITE_FRONT_END_URL}/agreement/${aggrementFromResponce._id}`;
      const dataForSentMessageOfAgreement = {
          message: `Agreement Link: ${link}`,
          listing: [aggrementFromResponce.listingId], // Add appropriate listing ID(s)
          receiver: aggrementFromResponce.receiverId, // Adjust as needed
      };
      const response = await createMessage(dataForSentMessageOfAgreement);
     
  } catch (error) {
      console.error("Error sending message:", error);
  }
};


  return (


<>
 

{
  list_category === 'car' && ( <CarAgreement convoID={convoID} tenant={tenant} listId={listId} list_Title={list_Title} list_category={list_category}  />  ) 
}

{
  list_category === 'house' && ( <HouseAgreement convoID={convoID} tenant={tenant} listId={listId} list_Title={list_Title} list_category={list_category}  />  )

}
{
  list_category === 'hostel' && ( <HostelAgreement convoID={convoID} tenant={tenant} listId={listId} list_Title={list_Title} list_category={list_category}  />  )

}
{
  list_category !== 'house' && list_category!== 'car' && list_category!== 'hostel' && (<Text>No agreement of this category found</Text>)
}
 


 


</>


//     <Box
//       minH="100vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       p={4}
//     >
//       <Card
//         w="full"
//         maxW="4xl"
//         bg="white"
//         shadow="lg"
//         position="relative"
//         overflow="hidden"
//       >
//         <Box
//           position="absolute"
//           inset="0"
//           bgImage="url('/placeholder.svg?height=600&width=800')"
//           opacity={0.05}
//           pointerEvents="none"
//         />
        
//         <Box position="relative" zIndex={10} p={[8, 12]}>
          
//           <Box textAlign="center" mb={8}>
//           <Flex alignItems={"center"} gap={4}>
//               <Text>The listing for which this agreement is being made is</Text>
//               <Menu>
//                 <MenuButton as={Button} w={"fit-content"} p={4}>
//                  {listTitle }
//                 </MenuButton>
//                 <MenuList>
//                   {listingDetail &&
//                     listingDetail.length > 0 &&
//                     listingDetail.map((list, i) => (
//                       <MenuItem
//                         key={list._id || i}
//                         onClick={() => listingFucntion(list._id, list.title)}
                      
                        
//                       >
//                         {list.title}
//                       </MenuItem>
//                     ))}
//                 </MenuList>
//               </Menu>
//             </Flex>



//             <Heading as="h1" size="lg" mb={2}>
//               RENTAL AGREEMENT
//             </Heading>
//             <Flex alignItems="center" justifyContent="center">
//               <Divider w={16} />
//               <Text px={4} color="gray.500" fontSize="sm">
//                 OFFICIAL DOCUMENT
//               </Text>
//               <Divider w={16} />
//             </Flex>
//           </Box>

//           <Box mb={4}>
//             <Text color={"red"} fontWeight={"semibold"}>
//               Note: This agreement will be stored in blockchain and can't be
//               updated or tempered later after the confirmation from both sides.
//             </Text>
//           </Box>

//           <VStack spacing={4} align="stretch" mb={8}>
//             <Text color="gray.700">
//               This agreement is made on the{" "}
//               <Text as="span" fontWeight="semibold">
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                   type="date"
//                 />
//                 day of
//                 <Input
//                 type="date"
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 , 2025
//               </Text>{" "}
//               between:
//             </Text>
//             <Flex justifyContent="space-between">
//               <Flex gap={5}>
//                 <Text fontWeight="semibold">Owner:</Text>
//                 {user && (
//                   <Text h={"fit-content"} borderBottom={"1px solid"}>
//                     {user.name}
//                   </Text>
//                 )}
//               </Flex>
//               <Box>
//                 <Flex gap={5}>
//                   <Text fontWeight="semibold">Tenant:</Text>

//                   <Text h={"fit-content"} borderBottom={"1px solid"}>
//                     {tenantName.name || ""}
//                   </Text>
//                 </Flex>
//               </Box>
//             </Flex>

           
//           </VStack>

//           <VStack align="stretch" spacing={4} mb={8}>
//             <Heading as="h2" size="md">
//               Terms and Conditions
//             </Heading>
//             <Box
//               as="ol"
//               listStyleType="decimal"
//               pl={4}
//               spacing={2}
//               color="gray.700"
//             >
//               <Text as="li">
//                 The owner agrees to rent the property located at{" "}
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   onChange={(e) =>
//                     setAggrementDetail({
//                       ...aggrementDetail,
//                       place: e.target.value,
//                     })
//                   }
//                   value={aggrementDetail.place}
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 to the tenant.
//               </Text>
//               <Text as="li">
//                 The lease term shall be for a period of{" "}
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   onChange={(e) =>
//                     setAggrementDetail({
//                       ...aggrementDetail,
//                       timeInDayCount: e.target.value,
//                     })
//                   }
//                   value={aggrementDetail.timeInDayCount}
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 months, starting from{" "}
//                 <Input
//                 type="date"
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 to{" "}
//                 <Input
//                 type="date"
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 .
//               </Text>
//               <Text as="li">
//                 The monthly rent shall be <b>PKR</b>
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   value={aggrementDetail.rentAmount}
//                   onChange={(e) =>
//                     setAggrementDetail({
//                       ...aggrementDetail,
//                       rentAmount: e.target.value,
//                     })
//                   }
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 , due on the{" "}
//                 <Input
//                 type="date"
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 day of each month.
//               </Text>
//               <Text as="li">
//                 A security deposit of <b>PKR</b>
//                 <Input
//                   border="none"
//                   borderBottom="1px solid"
//                   w="auto"
//                   _focus={{ boxShadow: "none" }}
//                   textAlign="center"
//                   fontWeight="semibold"
//                 />
//                 is required, refundable at the end of the lease term, subject to
//                 the condition of the property.
//               </Text>
//               <Text as="li">
//                 The tenant agrees to use the property for residential purposes
//                 only and to maintain it in good condition.
//               </Text>
//             </Box>
//           </VStack>

//           {/* <VStack align="stretch" spacing={4} mb={8}>
//                 <Heading as="h2" size="md">
//                   Signatures
//                 </Heading>
//                 <Flex justifyContent="space-between">
//                   <Box textAlign="center">
//                     <Box borderBottom="1px solid" borderColor="gray.300" w={48} h={16} mb={2} />
//                     <Text fontWeight="semibold">Owner Signature</Text>
//                   </Box>
//                   <Box textAlign="center">
//                     <Box borderBottom="1px solid" borderColor="gray.300" w={48} h={16} mb={2} />
//                     <Text fontWeight="semibold">Tenant Signature</Text>
//                   </Box>
//                 </Flex>
//               </VStack> */}


              
          

//           <Box>
//             <Heading as="h2" size="lg">
//               QR:
//             </Heading>
//             <Image
//               justifySelf={"center"}
//               src={
//                 "data:image/png;base64,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"
//               }
//             />
//           </Box>

//           <Box textAlign="center" color="gray.500" fontSize="sm" mt={8}>
//             <Text>
//               This is a legally binding document. Both parties should read the
//               terms carefully.
//             </Text>
//           </Box>
//         </Box>
        
//         <Button bg={"black"} color={"white"} onClick={saveAgreement}>
//           {" "}
//           Save Aggrement!
//         </Button>
//         <br></br>
//         <Button onClick={OwnerConfirmed} bg={ ownerConfirmed ? "green" : "black"} color={"white"}  >
//           {" "}
//          Click to Confirme Owner!
//         </Button>
//         <br />
// <Button bg={"black"} color={"white"} onClick={SentToRenter} >
//   Sent to the Renter To Review the aggrement
// </Button>


//       </Card>
      
//     </Box>


  );
} 




