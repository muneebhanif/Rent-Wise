import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { Printer, ScrollText, SquareMousePointer } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { fetchConversationsForSidebar } from "../../Api/Chats";
import AgreementTemplate from "../Agreement/AgreementTemplate";
import { useNavigate } from "react-router-dom";
import { ListingsContext } from "../../hooks/ListingsContext";

export default function UserPopover({tenant,convoID}) {
  // const [participantsDetail, setParticipantsDetail] = useState([]);
   const { state } = useContext(ListingsContext);
    const { userListings } = state;


  const navigate = useNavigate();




      const handleClick = (listId, list_Title, list_category)=>{
        navigate("/agreement", {
              state: { listId, list_Title , list_category, tenant ,convoID },
            });


      }

  

  

  return (
    <>
    
     {
      userListings.length > 0 ? (
        <Popover>
        <PopoverTrigger>
          <Flex gap={3} alignItems={"center"}>
            <Text cursor={'pointer'} fontWeight={"bold"} fontFamily={'cursive'} color={'orange.500'} fontSize={{base:'sm',md:"md"}}>
              Create Aggreement
            </Text>
            <Box display={{base:'none', sm:'inherit'}}>
            <ScrollText
        
            cursor={'pointer'}
              // onClick={fetchNameOfChatParticipants}
              size={40}
              color="#F57C00"
            />
            </Box>
          </Flex>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader color={'black'}>Select on which listing you want to create agreement on</PopoverHeader>
          <PopoverBody>
           

            {/* {participantsDetail &&
              participantsDetail.length > 0 &&
              participantsDetail.map((group, groupIndex) =>
                group.participants.map((p, pIndex) => (
                  <Flex
                    justifyContent={"space-between"}
                    key={`participant-${groupIndex}-${pIndex}`}
                  >
                    <Text mb={3} color={'black'} fontWeight={"semibold"}>
                      {p.name || ""}
                    </Text>
                    <SquareMousePointer
                      onClick={() =>
                        showAggrement(
                          p,
                          group.listing.map((l) => l),
                          group.conversationID
                        )
                      }
                      size={20}
                      color="#ff0000"
                    />
                  </Flex>
                ))
              )} */}

            {userListings.length > 0 &&
                userListings.map((p, pIndex) => (
                  <Flex
                  onClick={()=> handleClick(p._id, p.title, p.category)}
                
                  _hover={{bg:'gray.200', p:"10px", cursor:'pointer', borderRadius:'10px'}}
                    key={ p._id || pIndex}
                  >
                    <Text width={'full'} mb={3} color={'black'} fontWeight={"semibold"}>
                      {p.title || ""}
                    </Text>
                    <SquareMousePointer
                      size={20}
                      color="#ff0000"
                    />
                  </Flex>
                ))
              }
          </PopoverBody>
        </PopoverContent>
      </Popover>

      )  : ( <Text></Text>  )
     }
        
      
      
    </>
  );
}