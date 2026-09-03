import React, { useEffect, useRef, useState } from "react";
import SideChat from "./SideChat";
import LiveChat from "./LiveChat";
import { Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
// import { useSocketConnection } from "../../hooks/useSocketConnection";

import { io } from "socket.io-client";
import SideBar from "./SideBar";

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export default function MainChat() {
  const { user } = useAuth();
  const location = useLocation();
  const scrollRef = useRef(null);
  const { ownerIdDetails, listingIdDetails, userIdDetails } =
    location.state || {};
  const [owner, setOwner] = useState(null);
  const [item, setItem] = useState("");
  const [convoID, setConvoId] = useState("");
  const [Messages, setMessages] = useState([]);
  const [showPopOver, setShowPopOver] = useState(false);
  const [listings, setListings] = useState([]);
  const [allData, setAllData] = useState(null);
  const [isCLicked, setIsCLicked] = useState(false) // check if side bar is clicked to display messages
  const [checkClick, setCheckClick] = useState(false) // check if side bar is clicked display sidebae or livechat on basis of screen size
  const [countOfUnreedMessage, setCountOfunreedMessage] = useState(null);
  const [senderID, setSenderID] = useState(''); 

  useEffect(() => {
    if (user?._id) {
      socket.emit("join-user", user._id);
    }

    socket.on("newConversation", (data) => {
     
      setAllData((prevData) => {
        if (!prevData) return [data];
        const exists = prevData.some(
          (conv) => conv._id === data.conversation._id
        );
        if (!exists) {
          return [...prevData, data];
        }
        return prevData;
      });
    });
   

    return () => {
      socket.off("newConversation"); 
  
      if (user?._id) {
        socket.emit("leave-user", user._id);
      }
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [Messages]);

  const handleSideBarClick = (
    receiver_id,
    receiver_name,
    selectedParticipant,
    receiver_imageUrl
  ) => {
    setCountOfunreedMessage(null)
    setCheckClick(true)  // check if side bar is clicked display sidebar or livechat on basis of screen size
    setIsCLicked(true);  // check if side bar is clicked to display messages
    setShowPopOver(true);

    // Update owner state with the selected participant
    setOwner({
      _id: receiver_id,
      name: receiver_name,
      imageUrl: receiver_imageUrl,
    });

    // Filter data to find the relevant conversation for the selected participant
    const filteredData = allData.find((item) =>
      item.participants.some((participant) => participant._id === receiver_id)
    );
   
    // Extract the specific listings for this participant
    const specificListings = filteredData?.listing || [];
    
    if (!allData) return;
    const ConvoID = filteredData?._id || filteredData?.conversation._id ||[];
    setConvoId(ConvoID);

    // Update the state
    setItem(selectedParticipant);
    setListings(specificListings); // Set the specific listings
    setMessages([]); // Clear messages for the new conversation
  };

  return (
    
    <div className="flex h-screen max-h-screen bg-gray-100 overflow-hidden">


      <SideBar/>
     
        <SideChat
          listings={listings}
          allData={allData}
          setAllData={setAllData}
          setListings={setListings}
          handleSideBarClick={handleSideBarClick}
          owner={owner}
          setOwner={setOwner}
          ownerIdDetails={ownerIdDetails}
          userIdDetails={userIdDetails}
          listingIdDetails={listingIdDetails}
          isCLicked={isCLicked}
          checkClick={checkClick}
          setCountOfunreedMessage={setCountOfunreedMessage}
          countOfUnreedMessage={countOfUnreedMessage}
          senderID={senderID}
        />
        <LiveChat
        setSenderID={setSenderID}
        setCountOfunreedMessage={setCountOfunreedMessage}
        countOfUnreedMessage={countOfUnreedMessage}
          checkClick={checkClick}
          setCheckClick={setCheckClick}
          isCLicked={isCLicked}
          setIsCLicked={setIsCLicked}
          showPopOver={showPopOver}
          scrollRef={scrollRef}
          convoID={convoID}
          setConvoId={setConvoId}
          Messages={Messages}
          setMessages={setMessages}
          owner={owner}
          ownerIdDetails={ownerIdDetails}
          userIdDetails={userIdDetails}
          listingIdDetails={listingIdDetails}
          listings={listings}
          item={item}
        />
      </div>
    
  );
}
