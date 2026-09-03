import React, { useEffect, useState } from "react";
import { Star, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { StarIcon, MessageCircleIcon, MailIcon, PhoneIcon } from "lucide-react";
import { getOwnerProfileData } from "../../../Api/owner";
import { Link , Navigate, useNavigate , useParams} from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";
import { createUserReview, getUserReviews } from "../../../Api/reviews";
import { useToast, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Image, useDisclosure, Button  } from "@chakra-ui/react";
import ColorTubeLoader from "../../../components/Style/ColorTubeLoader";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { _id } = useParams();
  const [owner, setOwner] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([])
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null); 

  // if (!user) {
  //    return <div className="flex justify-center items-center min-h-screen"> <ColorTubeLoader/></div>;
  // }
 

  // if (user?._id === _id) {
  //   // Redirect to another route if user tries to view their own profile
  //   return <Navigate to="/acc" />;
  // }

  useEffect(() => {
      const fetchProfileData = async () => {
          try {
              const response = await getOwnerProfileData(_id);
              const { user, listings } = response.data.data;
              setOwner(user);
              setListings(Array.isArray(listings) ? listings : []);
          } catch (error) {
              console.error("Error fetching user profile:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchProfileData();
  }, [_id]);

  const handleChatButtonClick = () => {
      if (!user) {
          navigate('/auth/signup');
          return;
      }
      navigate(`/chat`, { state: { ownerIdDetails: owner, userIdDetails: user } });
  };
  


    const handleSubmitReview =async(e)=>{
      e.preventDefault();

      if(!user)
        {
          toast({
            title: "Login required",
            description: "Can't give a Review, Login first to add a review",
            status:"warning", 
            duration: 3000,
            isClosable: true,
          });
          return
  
        }

      if(!reviewText || !rating)
      {
        toast({
          title: "Rating or Review is missing!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return

      }
    
      try {
            const response = await createUserReview(owner?._id,{comment: reviewText, rating});
            if(response.status === 200)
            {
              toast({
                      title: response?.data?.data?.message,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                    setReviewText("");
                    setRating(0);
            }
        
      } catch (error) {
        toast({
          title: error?.response?.data?.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setReviewText("");
        setRating(0);  
      }
     
    }
  
    useEffect(()=>{
      const getReviews = async()=>{
        if(!owner) return
        try {
          const response = await getUserReviews(owner?._id);
          console.log(response)
         setReviews(Array.isArray(response?.data?.data?.reviews) ? response.data.data.reviews : [])
        } catch (error) {
          console.log(error);
          
        }
      }
      getReviews();
    },[owner, activeTab])


    // for viewing image in big size
    const handleImageClick = () => {
      setSelectedImage(`${import.meta.env.VITE_BACK_END_URL}${owner.imageUrl}` || owner.imageUrl);
      onOpen();
    };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //      <ColorTubeLoader/>
  //     </div>
  //   );
  // }

  // if (!owner) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>User not found.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-2 xl:p-8">
      {!user ? (
        <div className="flex justify-center items-center min-h-screen">
          <ColorTubeLoader />
        </div>
      ) : user._id === _id ? (
        <Navigate to="/acc" />
      ) : loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <ColorTubeLoader />
        </div>
      ) : !owner ? (
        <div className="flex justify-center items-center min-h-screen">
          <p>User not found.</p>
        </div>
      ) : (
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* User Information */}
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full mr-4"
            src={`${import.meta.env.VITE_BACK_END_URL}${owner.imageUrl}` || owner.imageUrl}
            alt={owner.name}
            onError={(e) => (e.currentTarget.src = "/images/randomUser.png")}
            onClick={handleImageClick}
          />
          <div>
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton color={'black'} bg={'white'} />
          <ModalBody className="flex justify-center p-4">
            {selectedImage && <Image src={selectedImage} alt={owner.name} />}
          </ModalBody>
        </ModalContent>
      </Modal>
            <h1 className="text-24px sm:text-24px xl:text-2xl font-bold">{owner.name}</h1>
            <p className="text-gray-500 text-16px sm:text-16px xl:text-20 capitalize">{owner.role}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-700">{owner.bio || "No bio provided."}</p>
        <div className="mt-4 flex gap-4 text-gray-600">
          {owner.email && (
            <span>
              <MailIcon className="inline h-5 w-5 mr-2" />
              {owner.email}
            </span>
          )}
          {owner.phoneNumber && (
            <span>
              <PhoneIcon className="inline h-5 w-5 mr-2" />
              {owner.phoneNumber}
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b">
          {['listings', 'reviews', 'writeReview'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-center text-sm sm:text-sm xl:text-md ${
                activeTab === tab
                //   ? 'text-indigo-600 border-b-2 border-indigo-600'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="mt-6 grid gap-6">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <Link
                  to={`/rental/${listing._id}`}
                  key={listing._id}
                  className="block"
                >
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-110 hover:shadow-lg cursor-pointer hover:bg-slate-300">
                    <img
                      className="h-16 w-16 object-cover rounded-lg mr-4"
                      src={`${import.meta.env.VITE_BACK_END_URL}${listing.images[0]?.url || ""}`}
                      alt={listing.title}
                      onError={(e) =>
                        (e.currentTarget.src = "/images/make_listing/random.png")
                      }
                    />
                    <div>
                      <h2 className="font-bold">{listing.title}</h2>
                      <p>
                        ${listing.price} / {listing.priceUnit}
                      </p>
                      <div className="flex items-center text-yellow-500 mt-2">
                        <StarIcon className="h-5 w-5" />
                        <span className="ml-1">
                          {listing?.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No listings available.</p>
            )}
          </div>
        )}




           {activeTab === "reviews" && (
  <div className="mt-6 grid md:grid-cols-2 gap-6">
    {["positive", "negative"].map((reviewType) => (
      <div key={reviewType}>
        <h3 className="font-bold text-lg mb-4 flex items-center">
          {reviewType === "positive" ? (
            <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
          )}
          {reviewType.charAt(0).toUpperCase() + reviewType.slice(1)} Reviews
        </h3>

        <div className="space-y-4">
          {reviews
            .filter((review) => review.sentiment === reviewType) // ✅ correct filtering
            .map((review) => (
              <div
                key={review._id}
                className={`p-4 rounded-lg shadow-sm ${
                  reviewType === "positive" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-bold">{review.reviewer.name}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.comment}</p>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
)}

        {/* Write Review Tab */}
        {activeTab === "writeReview" && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400 focus:outline-none focus:text-yellow-400`}
                    >
                      <StarIcon className="h-8 w-8" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Review
                </label>
                <textarea
                  
                  id="review"
                  rows={4}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                variant={'customButton'}
                w={'full'}
                //className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </Button>
            </form>
          </div>
        )}

        {/* Contact Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleChatButtonClick}
            variant={'customButton'}
            className="bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition duration-300 flex items-center">
            <MessageCircleIcon className="h-5 w-5 mr-2" />
            Contact {owner.name}
          </Button>
        </div>
      </div>
)}
    </div>
  );
};

export default UserProfile;
