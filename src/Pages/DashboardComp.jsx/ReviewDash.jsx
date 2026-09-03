import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, Flex, Avatar } from '@chakra-ui/react';
import { ToGetReview } from '../../Api/DashboardAPI';
import { format } from 'date-fns';
import { getUserReviews } from '../../Api/reviews';
import { useAuth } from '../../hooks/AuthContext';
import SpinLoader from '../../components/Style/SpinLoader';

// const receivedReviews = [
//   {
//     id: '1',
//     reviewerName: 'Alice Johnson',
//     reviewerAvatar: '/placeholder.svg',
//     rating: 5,
//     comment: 'Great experience! The item was in perfect condition.',
//     date: '2023-05-24',
//   },
//   {
//     id: '2',
//     reviewerName: 'Bob Smith',
//     reviewerAvatar: '/placeholder.svg',
//     rating: 4,
//     comment: 'Good rental, but could use some minor improvements.',
//     date: '2023-06-15',
//   },
// ];

// const potentialReviews = [
//   {
//     id: '1',
//     ownerId: 'owner456',
//     ownerName: 'John Doe',
//     ownerAvatar: '/placeholder.svg',
//     listingId: 'listing123',
//     listingTitle: 'Luxury Sedan',
//     rentalDate: '2023-07-01',
//     images: ['/placeholder.svg', '/placeholder.svg'],
//   },
//   {
//     id: '2',
//     ownerId: 'owner789',
//     ownerName: 'Jane Smith',
//     ownerAvatar: '/placeholder.svg',
//     listingId: 'listing456',
//     listingTitle: 'Beachfront Villa',
//     rentalDate: '2023-07-15',
//     images: ['/placeholder.svg', '/placeholder.svg'],
//   },
// ];

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);



export default function ReviewPage() {
  // those who you can review
    const [peopleData, setPeopleData] = useState([]);  
    const {user} = useAuth();
    // reviews you got
    const [receivedReviews, setReceivedReviews] = useState([]);
    const [loading, setLoading] = useState(true);


    // people or listing u can review
    useEffect(() => {
        const funcToGetReview = async () => {
          try {
            const response = await ToGetReview();
      
      
            if (response && response.data) {
              setPeopleData(response?.data?.data);
      
              const reviewData = response.data.data || [];  
              
             
            } else {
              console.warn("No data found in response");
            }
          } catch (error) {
            console.error("Error fetching review data:", error);
          }
          
        };
      
        funcToGetReview();
      }, []);


      // reviews u got
      useEffect(()=>{
            const getReviews = async()=>{
              if(!user) return
              try {
                const response = await getUserReviews(user._id);
                setReceivedReviews(response?.data?.data?.reviews)
              } catch (error) {
                console.log(error); 
              }
              finally{
                setLoading(false);
              }
            }
            getReviews();
          },[user])
          
  
if (loading) {
    return (
      <Flex flexDir={'column'} justify="center" align="center" height="100vh">
        {/* <Spinner size="xl" /> */}
        <SpinLoader/>
      </Flex>
    );
  }

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <h1 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h1>
    //   <Tabs variant="enclosed">
    //     <TabList mb="4">
    //       <Tab>Reviews You've Received</Tab>
    //       <Tab>People You Can Review</Tab>
    //     </TabList>
    //     <TabPanels>
    //       <TabPanel>
    //         <Card>
    //           <CardBody>
    //             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews You've Received</h2>
    //             <div className="space-y-6 mx-4 ">
    //               {receivedReviews?.map((review, i) => (
    //                 <div key={review._id || i} className="flex items-start space-x-4">
    //                   <Avatar
    //                     src={`${import.meta.env.VITE_BACK_END_URL}${review.reviewer.imageUrl}` || '/placeholder.svg'}
    //                     alt={review.reviewer.name}

    //                   />
    //                   <div className="flex-1">
    //                     <div className="flex items-center justify-between">
    //                       <h3 className="text-lg font-medium text-gray-900">{review.reviewer.name}</h3>
    //                       <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</span>
    //                     </div>
    //                     <StarRating rating={review.rating} />
    //                     <p className="mt-2 text-gray-600">{review.comment}</p>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </CardBody>
    //         </Card>
    //       </TabPanel>
    //       <TabPanel>
    //         <Card>
    //           <CardBody>
    //             <h2 className="text-2xl font-semibold text-gray-900 mb-4">People You Can Review</h2>
    //             <div className="space-y-6 mx-4 ">
    //               {peopleData && peopleData.length > 0 && peopleData.map((item) => (
    //                 <div key={item.agreementId} className="flex flex-col md:flex-row md:items-start md:space-x-4">
    //                   <div className="flex-shrink-0 mb-4 md:mb-0">
    //                     {
    //                         item.listing.images.length > 0 ? (
    //                             <img
    //                       src={`${import.meta.env.VITE_BACK_END_URL}${item.listing.images[0].url}` || '/placeholder.svg'}
    //                       alt={item.listingTitle}
    //                       width={120}
    //                       height={80}
    //                       className="rounded-md object-cover"
    //                     />
    //                         ) : (
    //                             <img
    //                       src={'/images/make_listing/random.png'}
    //                       alt={item.listingTitle}
    //                       width={120}
    //                       height={80}
    //                     />
    //                          )
    //                     } 
                        
                    
    //                   </div>
    //                   <div className="flex-grow">
    //                     <div className="flex items-center justify-between mb-2">
    //                       <h3 className="text-lg font-medium text-gray-900">{item.listing.title}</h3>
    //                       <span className="text-sm text-gray-500">
    //                         Rented on: {format(new Date(item.agreementDate), "MMMM dd, yyyy")}
    //                       </span>
    //                     </div>
    //                     <div className="flex items-center space-x-2 mb-2">
    //                       <Avatar
    //                         src={`${import.meta.env.VITE_BACK_END_URL}${item.user.imageUrl}` || '/placeholder.svg'}
    //                         alt={item?.user?.name}
    
    //                       />
    //                       <Link to={`/profile/${item?.user?.id}`}>
    //                       <span className="text-sm text-gray-600 cursor-pointer">{item.user.name}</span>
    //                       </Link>
                          
    //                     </div>
    //                     <div className="flex flex-wrap gap-2 mb-4">
    //                       {/* {item.images.slice(1).map((image, index) => (
    //                         <img
    //                           key={index}
    //                           src={image || '/placeholder.svg'}
    //                           alt={`${item.listingTitle} image ${index + 2}`}
    //                           width={80}
    //                           height={60}
    //                           className="rounded-md object-cover"
    //                         />
    //                       ))} */}
                          
    //                     </div>

    //                   <Flex flexDir={'column'} justifySelf={'end'} gap={2}>
    //                     <div >
    //                       <Link to={`/rental/${item?.listing?._id}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center">
    //                         Review Listing
    //                         <FaExternalLinkAlt className="ml-1 w-3 h-3" />
    //                       </Link>
    //                     </div>
    //                     <div >
    //                       <Link to={`/profile/${item?.user?.id}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center">
    //                         Review Owner
    //                         <FaExternalLinkAlt className="ml-1 w-3 h-3" />
    //                       </Link>
    //                     </div>
    //                     </Flex>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </CardBody>
    //         </Card>
    //       </TabPanel>
    //     </TabPanels>
    //   </Tabs>
    // </div>




    <div className="container mx-auto px-0 py-8">
  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Reviews</h1>
  <Tabs variant="enclosed">
    <TabList mb="4" overflowX="auto" className="flex-wrap">
      <Tab>Reviews You've Received</Tab>
      <Tab>People You Can Review</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <Card>
          <CardBody>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Reviews You've Received
            </h2>
            <div className="space-y-6 sm:mx-4">
              {receivedReviews?.map((review, i) => (
                <div key={review._id || i} className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar
                    src={`${import.meta.env.VITE_BACK_END_URL}${review.reviewer.imageUrl}` || '/placeholder.svg'}
                    alt={review.reviewer.name}
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{review.reviewer.name}</h3>
                      <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="mt-2 text-gray-600 break-words">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </TabPanel>
      <TabPanel>
        <Card>
          <CardBody>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">People You Can Review</h2>
            <div className="space-y-6 sm:mx-4">
              {peopleData?.length > 0 &&
                peopleData.map((item) => (
                  <div key={item.agreementId} className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <img
                        src={
                          item.listing.images.length > 0
                            ? `${import.meta.env.VITE_BACK_END_URL}${item.listing.images[0].url}`
                            : '/images/make_listing/random.png'
                        }
                        alt={item.listingTitle}
                        width={120}
                        height={80}
                        className="rounded-md object-cover w-full max-w-[120px] h-auto"
                      />
                    </div>
                    <div className="flex-grow w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{item.listing.title}</h3>
                        <span className="text-sm text-gray-500">
                          Rented on: {format(new Date(item.agreementDate), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar
                          src={`${import.meta.env.VITE_BACK_END_URL}${item.user.imageUrl}` || '/placeholder.svg'}
                          alt={item?.user?.name}
                        />
                        <Link to={`/profile/${item?.user?.id}`}>
                          <span className="text-sm text-gray-600 cursor-pointer">{item.user.name}</span>
                        </Link>
                      </div>
                      <Flex direction="column" gap={2} mt={2}>
                        <Link
                          to={`/rental/${item?.listing?._id}`}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
                        >
                          Review Listing
                          <FaExternalLinkAlt className="ml-1 w-3 h-3" />
                        </Link>
                        <Link
                          to={`/profile/${item?.user?.id}`}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
                        >
                          Review Owner
                          <FaExternalLinkAlt className="ml-1 w-3 h-3" />
                        </Link>
                      </Flex>
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      </TabPanel>
    </TabPanels>
  </Tabs>
</div>

  );
}
