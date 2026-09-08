import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Divider,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";
import UserPopover from "../DashboardComp.jsx/UserPopover";
import { ListingsContext } from "../../hooks/ListingsContext";
import { Link } from 'react-router-dom';

import { io } from "socket.io-client";
import ListingsHorizontalBox from "./ListingsHorizontalBox";
import { ArrowBigLeft } from "lucide-react";
import { chatMediaUrl } from './chatMedia';

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
  autoConnect: !String(import.meta.env.VITE_BACK_END_URL).includes("vercel.app"),
});

export default function LiveChat({
  showPopOver,
  scrollRef,
  owner,
  listingIdDetails,
  convoID,
  setConvoId,
  Messages,
  setMessages,
  listings,
  isCLicked,
  setIsCLicked,
  checkClick,
  setCheckClick
}) {
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showChat,setShowChat] = useState(true)
  const [showBid,setShowBid] = useState(false)
  const [activeTab, setActiveTab] = useState("chat");

  const { user } = useAuth();
  const [localListingId, setLocalListingId] = useState([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [message]);



  useEffect(() => {
    if (listings) {
      const listing_id = listings.map((list) => list._id);
      setLocalListingId(listing_id);
    }
  }, [listings]);

  useEffect(() => {
    if (!convoID) return ;

    socket.emit("join-conversation", convoID);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit("leave-conversation", convoID);
      socket.off("receiveMessage");
    };
  }, [convoID]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !owner?._id) return;

    try {
      const listingsToSend = listingIdDetails || localListingId || [];

      const data = {
        message,
        listing: listingsToSend,
        receiver: owner._id,
      };

      const response = await createMessage(data);

      if (response?.data?.data) {
        const sentMessage = response.data.data;
        setMessages((previous) => [...previous, sentMessage]);
        setConvoId(sentMessage.conversation);
      }
      
       
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!owner || !convoID) return;

      try {
        const response = await fetchMessagesByConversation(convoID);
        setMessages(response?.data?.data || []);
        setIsCLicked(false)
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    // Poll the active conversation because persistent WebSockets are not
    // guaranteed when the API is hosted as a Vercel serverless function.
    const poll = window.setInterval(fetchMessages, 3000);
    return () => window.clearInterval(poll);
  }, [convoID, owner, isCLicked]);

  return (
    <Flex
  flexDir="column"
  flex="1"
  bg="gray.50"
  boxShadow="sm"
  w={{ base: "100%", sm: "75%" }}
  h="100vh"
  display={{ base: checkClick ? "inherit" : "none", md: "inherit" }}
  overflow="hidden" // ✅ Prevents unintended blank space
>
      

      {/* top bar of live chat */}
      <HStack
        display={"flex"}
        justifyContent={"space-between"}
        color={"white"}
        p={{base:2, sm:4}}
        bg={"white"}
        h={{ base: "72px", md: "84px" }}
        borderBottom="1px solid"
        borderColor="gray.200"
        px={{ base: 3, md: 6 }}
       
      >
        
        {owner && (
          <Flex alignItems={"center"}>
            <Box display={{ base: checkClick ? 'inherit' : 'none', md: 'none' }} onClick={()=> setCheckClick(false) }>
            <ArrowBigLeft color="#f78f4b" />
            </Box>
            <Link
              to={`/profile/${owner._id}`}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Avatar
                mr={2}
                size={{base:'sm',sm:'md'}}
                name={owner.name}
                bg="orange.100"
                color="orange.700"
                src={chatMediaUrl(owner.imageUrl)}
              />
              <Text color={'black'} fontWeight={'semibold'} fontSize={{base:'sm', sm:'lg', md:'xl'}}>{owner.name}</Text>
            </Link>
          </Flex>
        )}
        {
          // sending data to agreement
          owner && showPopOver && (
            <UserPopover convoID={convoID} tenant={owner} listings={listings} />
          )
        }
      </HStack>
    

      <Box
        
        ref={scrollRef}
        height="300px"
        overflowY="scroll"
        borderTop={'1px solid #E0E0E0'}
        borderBottom={'1px solid #E0E0E0'}
        
        display={"flex"}
        flex="1"
        p={{ base: 3, md: 6 }}
        flexDir={"column"}
        gap={4}
  
      >
        {Messages &&
          Messages.length > 0 &&
          Messages.map((Messages, i) => (
            <Box
              key={Messages._id || i}
              color={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "white"
                  : "gray.700"
              }
              borderRadius={"8px"}
              w={"fit-content"}
              maxW={{base:'200px',sm:'350px'}}
              p={2}
              bg={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "orange.500"
                  : "white"
              }
              border={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "none"
                  : "1px solid #E0E0E0"
              }
              alignSelf={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "flex-end"
                  : "flex-start"
              }
            >
              <Text wordBreak="break-word" fontSize={'sm'}>{Messages.message}</Text>
            </Box>
          ))}


        { !checkClick && (
           <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic' }}>
             <Text>🌟 Select a participant to start chatting and let the conversation flow! 🌟</Text>
           </div>
         )
         }
      </Box>



{/* bidding and send message work */}
{
  checkClick && (
    <Flex bg={'white'} py={6}>
    <form onSubmit={handleMessageSubmit} style={{ width: "100%" }}>
  
    <Box>   

  {/* chat one */}
  {
    showChat && (
      <Flex>
      <Input
        placeholder="Type your message..."
        mx={4}
        bg="white"
        borderRadius="full"
        _focus={{ outline: "none" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        autoComplete="off"
        spellCheck="false"
      />
      <Button type="submit" colorScheme="orange" rounded="full" mr={2}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </Button>
    </Flex>
    )
  }       
    </Box>
      </form>
  </Flex>

  )
}
    
    </Flex>
  );
}
