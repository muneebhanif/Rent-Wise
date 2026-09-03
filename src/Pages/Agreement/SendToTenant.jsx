import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  ButtonGroup,
  Text,
  useToast,
  
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
const socket = io(import.meta.env.VITE_BACK_END_URL, { withCredentials: true });
import { io } from "socket.io-client";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";
import { createAgreement , SentAggreement } from "../../Api/Agreement";

import ViewHouseAgr from './ViewAgreement.jsx/ViewHouseAgr';
import ViewCarAgr from './ViewAgreement.jsx/ViewCarAgr';

export default function SendToTenant({ mainDetails ,isOpen, setIsOpen,  open, close}) {
    const location = useLocation();
//  const { mainDetails} = location.state || {};
 const [_id, set_id] = useState('')
 const [conversationID, setConversationID] = useState('')
 const [renterId, setRenterId] = useState('')
 const [listingId, setListingId] = useState('')
//  const [ confirmed, setConfirmed] = useState(false);
 const navigate = useNavigate();
 const toast =  useToast();
//  const [isOpen, setIsOpen] = React.useState(false)
//  const open = () => setIsOpen(!isOpen)
//  const close = () => setIsOpen(false)




  useEffect(()=>{
    set_id(mainDetails._id)
    setConversationID(mainDetails.conversationID);
    setRenterId(mainDetails?.renterId._id)
    setListingId(mainDetails?.listingId._id)

  },[mainDetails])

  const SentMessageToRenter = async () => {
    socket.emit("join-conversation", conversationID);
  
    try {
      if(!mainDetails)
      {
        return
      }
      let link;
      if(mainDetails.listingId.category === 'house')
      {
         link = `${import.meta.env.VITE_FRONT_END_URL}/viewHouseAgreement/${_id}`;
      }
      else if(mainDetails.listingId.category === 'car')
      {
         link = `${import.meta.env.VITE_FRONT_END_URL}/viewCarAgreement/${_id}`;
      }
      else if(mainDetails.listingId.category === 'hostel')
      {
         link = `${import.meta.env.VITE_FRONT_END_URL}/viewHostelAgreement/${_id}`;
      }
      else{
        return;
      }
       
        const aggrementFromResponce = {
            message: `Agreement Link: ${link}`,
            listing: [listingId], // Add appropriate listing ID(s)
            receiver: renterId, // Adjust as needed,
            _id,
            conversationID,
            
        };
  
      
  
   
        const response = await SentAggreement({aggrementFromResponce});
       if(mainDetails?.renterId?.name)
       {
        toast({
          title: "Success",
          description: `Agreement sent to ${mainDetails?.renterId?.name}`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

       }
        navigate('/dashboard')
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };
  

  return (
    <>
  
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={close}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Text fontSize={'xx-small'} colorScheme='pink'>.</Text>
        </PopoverTrigger>
        <PopoverContent >
          <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            Are you sure you want to send this agreement to {mainDetails?.renterId?.name}
          </PopoverBody>
          <PopoverFooter d='flex' justifyContent='flex-end'>
            <ButtonGroup size='sm'>
              <Button variant='outline' onClick={()=> setIsOpen(false)}>No</Button>
              <Button colorScheme='red' onClick={SentMessageToRenter}>Yes</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

    </>
    

  )
}


