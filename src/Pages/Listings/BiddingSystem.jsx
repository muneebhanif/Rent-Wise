import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Avatar,
  UnorderedList,
  ListItem,
  Text,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { PlaceBid } from "../../Api/ListingApi";
import { useAuth } from "../../hooks/AuthContext";

import { FaGavel, FaArrowLeft, FaPhone, FaComments } from "react-icons/fa";

export default function BiddingSystem({ currentListing }) {
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState("");
  const toast = useToast();
  const { user } = useAuth();

  const handleBid = async (e) => {
    e.preventDefault();

    if(!user)
    {
      toast({
        title: `Login Requied`,
        description: `Login first to Bid!`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      
    }
  
   
    const bidAmount = parseFloat(newBid);
    if (isNaN(bidAmount) || bidAmount <= 0){

      toast({
        title: 'Increase bid to submit',
        description: 'Your bid must be higher than the current highest bid',
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    } 

    const newBidEntry = {
      rentalItemId: currentListing._id,
      bidAmount: bidAmount,
    };
 
    try {
      const response = await PlaceBid(newBidEntry);
      setNewBid(response?.data?.highestBid + currentListing?.bidding?.bidIncrement);
      if (response.status === 200) {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }

      // the new bid a user will submit will be added in it and displayed for real-time
      const newBidSubmited = {
        bidAmount: bidAmount,
        bidDate: Date().now,
        user: {
          imageUrl: user.imageUrl,
          name: user.name,
          _id: user._id,
        },
      };

      //here we will add that bid with others and then again sort them with the bidAmount
      const updatedBids = [newBidSubmited, ...bids]
        .sort((a, b) => b.bidAmount - a.bidAmount)
        .slice(0, 5);
      // here we updated that state
      setBids(updatedBids);
     // setNewBid("");
    } catch (error) {
      if(error.status === 400)
      {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });

      }
      else{
        toast({
          title: `${error.response.data.error}`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      
    }
  };

  useEffect(() => {

  // setting new bid to value so dont give error in submit function
    if(currentListing?.bidding?.highestBid > 0)
    {
      setNewBid(currentListing?.bidding?.highestBid + currentListing?.bidding?.bidIncrement); 
    }
    else
    {
      setNewBid(currentListing?.bidding?.minimumBid); 
    }
    
    const top5Bids = [...currentListing.bidding.bids]
      .sort((a, b) => b.bidAmount - a.bidAmount)
      .slice(0, 5);
    setBids(top5Bids);
  }, [currentListing]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full">
      <div className="bg-orange-400 text-white p-4">
        <h2 className="text-2xl font-bold">Bidding System</h2>
      </div>
      {currentListing?.owner._id === user?._id && (
        <Alert status="info" fontSize={"sm"}>
          <AlertIcon />
          You can chat with any of the top bidders by clicking on their name
        </Alert>
      )}
      <div className="p-4">
        {currentListing?.owner._id !== user?._id && user && (
          <form onSubmit={handleBid} className="mb-6">
            <div className="flex gap-2">
              <NumberInput
                onChange={(valueString) => setNewBid(valueString)}
                //defaultValue={currentListing?.bidding?.minimumBid + currentListing?.bidding?.bidIncrement}
                
                value={newBid || (currentListing?.bidding?.highestBid > 1 
                  ? (currentListing?.bidding?.highestBid + currentListing?.bidding?.bidIncrement)
                  : (currentListing?.bidding?.minimumBid))
                }
                min={currentListing?.bidding?.minimumBid}
                step={currentListing?.bidding?.bidIncrement}
                w={"full"}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                type="submit"
                colorScheme="orange"
                rounded="full"
                display="flex"
                alignItems="center"
                leftIcon={<FaGavel />}
              >
                Place Bid
              </Button>
            </div>
          </form>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">Top 5 Bids</h3>
          <UnorderedList className="space-y-3" m={0} p={0}>
            {bids && bids.length > 0 ? (
              bids?.map((bid, i) => (
                <ListItem
                  as={Link}
                  // to={`/profile/${bid.user._id}`}
                  to={user?._id === bid.user._id ? '#' : `/profile/${bid.user._id}`}
                  key={i}
                  className="flex items-center gap-3 bg-orange-50 p-3 rounded-md"
                >
                  {bid.user.imageUrl ? (
                    <Avatar
                      src={
                        `${import.meta.env.VITE_BACK_END_URL}${
                          bid.user.imageUrl
                        }` || "/placeholder.svg"
                      }
                      alt={bid.user.name}
                    />
                  ) : (
                    <User className="w-10 h-10 p-2 bg-orange-200 rounded-full text-orange-600" />
                  )}
                  <div className="flex-grow">
                    <p className="font-medium">{bid.user.name}</p>
                    <p className="text-sm text-gray-600">
                      ${bid?.bidAmount?.toLocaleString()}
                    </p>
                  </div>
                </ListItem>
              ))
            ) : (
              <Text>No biddings yet</Text>
            )}
          </UnorderedList>
        </div>
      </div>
    </div>
  );
}