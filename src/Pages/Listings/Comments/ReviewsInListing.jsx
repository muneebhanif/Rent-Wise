import React, { useEffect, useState } from 'react'
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { createListingReview, getListingReviews } from '../../../Api/reviews'
import { useAuth } from '../../../hooks/AuthContext'
import { Box, Button, Text, useToast } from '@chakra-ui/react'
// const reviews = [
//   {
//     id: '1',
//     user: 'Alice Johnson',
//     rating: 5,
//     date: '2023-06-15',
//     comment: 'Absolutely stunning villa! The views were breathtaking and the amenities were top-notch. We had an unforgettable stay.',
//   },
//   {
//     id: '2',
//     user: 'Bob Smith',
//     rating: 4,
//     date: '2023-05-28',
//     comment: 'Great location and beautiful property. The only minor issue was that the Wi-Fi was a bit slow at times.',
//   },
//   {
//     id: '3',
//     user: 'Carol Williams',
//     rating: 5,
//     date: '2023-05-10',
//     comment: "Perfect getaway! The villa was immaculate and the private beach access was a huge plus. We'll definitely be back!",
//   },
// ]

export default function ReviewsInListing({listingID, ownerID, setAvgRating}) {
   const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
   const [reviews,setReview ] = useState([]);
   const {user} = useAuth();
   const toast = useToast();

  const handleReviewSubmit =async(e)=>{
    e.preventDefault();

    try {

      if(!user)
      {
        toast({
          title: "Login required",
          description: "Can't give a Review, Login first to add a review",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return

      }
      if(!newReview.rating || !newReview.comment)
      {
        toast({
          title: "Rating or Review is missing!",
          // description: "Listing not selected yet, select again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return
      }

      if (listingID)
        {
          const response = await createListingReview(listingID,{comment: newReview.comment, rating: newReview.rating});
          if(response.status === 200)
          {
            toast({
                    title: response?.data?.data?.message,
                    // description: "Listing not selected yet, select again.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
            setNewReview({comment:'', rating:0})
          }

    
        }
       
    } catch (error) {
     
      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setNewReview({comment:'', rating:0})
      
    }
   
  }

  useEffect(()=>{
    const getReviews = async()=>{
      try {
        const response = await getListingReviews(listingID);
        setReview(response?.data?.data?.reviews)

        const reviews = response?.data?.data?.reviews || [];

  const averageRating =
  reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : "No ratings and";

 setAvgRating(averageRating)


      } catch (error) {
        console.log(error);
        
      }
    }
    getReviews();
  },[])
  
  return (
    
    <Box>
      <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                  {
                    user?._id !== ownerID && (
                  <form onSubmit={handleReviewSubmit} className="mb-6">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="text-2xl focus:outline-none"
                          >
                            {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="review" className="block text-gray-700 text-sm font-bold mb-2">Your Review</label>
                      <textarea
                        id="review"
                        rows={4}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <Button type="submit"  variant={'customButton'}>
                      Submit Review
                    </Button>
                  </form>
                    )
                  }
                  <div className="space-y-4">
                    { reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{review.reviewer.name}</span>
                            <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (<Text>🌟 No reviews on this listing yet 🌟</Text>) }
                  </div>
                </div>
                </Box>
      
  
  )
}
