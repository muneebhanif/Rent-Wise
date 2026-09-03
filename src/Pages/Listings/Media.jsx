import React, { useContext, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, Heading, useToast, Textarea, Flex, Text, Image,
  Switch, Select,
  HStack} from "@chakra-ui/react";
import { uploadMediaAPI } from "../../Api/ListingApi";  
import { useAuth } from "../../hooks/AuthContext";
import { ListingsContext } from '../../hooks/ListingsContext';
import LocationSearch from '../Location/Loacation';

export default function Media() {
  const [formData, setFormData] = useState({
    amenities: [],  // Start with one empty amenity
    rules: [],      // Start with one empty rule
    biddingEnabled: false,
    minimumBid: '',
    bidIncrement: '',
    bidEndDate: '',
    location: null,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // For image previews
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();
  const { state, dispatch } = useContext(ListingsContext); 
  const { listings } = state; 

  // New state variables for other rental information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [facilities, setFacilities] = useState({ bedrooms: 0 , bathrooms: 0 })

  const toast = useToast();

  const handleLocationSelect = (locationDetails) => {
    setFormData((prev) => ({
      ...prev,
      location: locationDetails,
    }));
  };

  // Handle image selection and generate previews
  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);

    // Create image previews
    const previewUrls = [];
    for (let i = 0; i < files.length; i++) {
      const imageUrl = URL.createObjectURL(files[i]);
      previewUrls.push(imageUrl);
    }
    setImagePreviews(previewUrls); // Set previews for rendering
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    setVideos(e.target.files);
  };

  // Add new amenity field
  const handleAddAmenity = () => {
    setFormData((prevData) => ({
      ...prevData,
      amenities: [...prevData.amenities, ""],
    }));
  };

  // Add new rule field
  const handleAddRule = () => {
    setFormData((prevData) => ({
      ...prevData,
      rules: [...prevData.rules, ""],
    }));
  };

  // Handle amenity change
  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData((prevData) => ({ ...prevData, amenities: newAmenities }));
  };

  // Handle rule change
  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prevData) => ({ ...prevData, rules: newRules }));
  };

  const handleBiddingToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      biddingEnabled: !prevData.biddingEnabled,
    }));
  };

  // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!user) {
    toast({
      title: "Not authenticated.",
      description: "Please log in to upload listing.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

 
  if (formData.biddingEnabled==true) {
    if (!formData.minimumBid || !formData.bidEndDate) {
      toast({
        title: "Missing required fields.",
        description: "Bidding enabled but missing required fields: Minimum Bid and Bid End Date.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }

  if (!formData.location ) {
    toast({
      title: "Location Required.",
      description: "please select location.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
   
      return;
    }

  const formDataToSend = new FormData();
  formDataToSend.append('owner', user._id);
  formDataToSend.append('title', title);
  formDataToSend.append('description', description);
  formDataToSend.append('price', price);
  formDataToSend.append('category', category);
  formDataToSend.append('priceUnit', priceUnit);
  formDataToSend.append('amenities', JSON.stringify(formData.amenities));
  formDataToSend.append('rules', JSON.stringify(formData.rules));
  formDataToSend.append('biddingEnabled', formData.biddingEnabled ? 'true' : 'false'); //changed
  formDataToSend.append('minimumBid', formData.minimumBid);
  formDataToSend.append('bidIncrement', formData.bidIncrement);
  formDataToSend.append('bidEndDate', formData.bidEndDate);
  formDataToSend.append('bedrooms', facilities.bedrooms);
  formDataToSend.append('bathrooms', facilities.bathrooms);
 formDataToSend.append('location', JSON.stringify(formData.location));



  // Append each image
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formDataToSend.append('images', images[i]);
    }
  }

  // Append each video
  if (videos.length > 0) {
    for (let i = 0; i < videos.length; i++) {
      formDataToSend.append('videos', videos[i]);
    }
  }

  for (let [key, value] of formDataToSend.entries()) {
    console.log(`${key}:`, value);
  }
  

  try {
    const response = await uploadMediaAPI(formDataToSend);
    dispatch({type:'ADD_LISTING',payload:response.data.rentalItem})

    toast({
      title: "Listing uploaded.",
      description: "Your Listing has been uploaded successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Clear the form after submission
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setPriceUnit('');
    setFacilities({ bathrooms: 0 , bedrooms: 0 })
    setFormData({
      amenities: [],
      rules: [],
      biddingEnabled: false,
      minimumBid: '',
      bidIncrement: '',
      bidEndDate: '',
      location: null,
    });
    setImages([]);
    setVideos([]);
    setImagePreviews([]); // Clear image previews after submission

  } catch (error) {
    toast({
      title: "Upload failed.",
      description: error.response?.data?.error || "An error occurred during upload.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    console.error("Error uploading media:", error.response?.data?.error || error);
  }
};


  return (
    <Flex py={{base:'20px', md:'50px'}} flexDir={'column'}>
    {/* <Flex gap={4} alignSelf={'center'} justifyContent={'space-between'} alignItems={'center'} flexDir={'row'} borderRadius={'10px'} bg={'gray.900'} color={'white'}    w={'90%'}>
             <Image alignSelf={'flex-end'} w={'22vw'} h={'auto'}  src="https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjA3LTItMzMwXzEuanBn.jpg"/>
             <Box alignSelf={'center'} py={'50px'} >
            <Heading textAlign={'left'}  fontWeight="extrabold" >Upload Your Property | Vehichle Details</Heading>
            <Text pt={4}>We're committed to providing a reliable marketplace for all your property and vehicle needs</Text>
             </Box>
            
             <Image alignSelf={'flex-end'} w={'16vw'} h={'auto'} src="https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvbnMyMDA0Ni1pbWFnZS1rd3Z5YTF1Yy5qcGc.jpg"/>
            </Flex> */}
<Flex
  gap={4}
  alignSelf="center"
  justify="space-between"
  borderRadius="10px"
  bg="gray.900"
  color="white"
  w="90%"

   px={{base: 1, md: 6 , lg:0}}
   py={{base: 6, md: 8 , lg:0}}
>
  {/* Left Image */}
  <Image
    h="250px"
    w="auto"
    objectFit="cover"
    display={{ base: "none", md: "none", lg: "block" }}
    src="https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjA3LTItMzMwXzEuanBn.jpg"
  />

  {/* Center Text */}
  <Flex flexDir={'column'}  justifyContent={'center'} flex="1" px={4}>
    <Heading fontSize={{base:'24px', md:'32px'}}  textAlign="center"  fontWeight="extrabold">
      Upload Your Property | Vehicle Details
    </Heading>
    <Text textAlign="center" fontSize={{base:'14px', md:'16px'}}  pt={4}>
      We're committed to providing a reliable marketplace for all your property and vehicle needs.
    </Text>
  </Flex>

  {/* Right Image */}
  <Image
  h="250px"
  w="auto"
  objectFit="cover"
  display={{ base: "none", md: "none", lg: "block" }}
  src="https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvbnMyMDA0Ni1pbWFnZS1rd3Z5YTF1Yy5qcGc.jpg"
/>

</Flex>


      <form onSubmit={handleSubmit}>
        <Flex flexDir={{base: 'column', md:'row' , lg:'row'}} justifyContent={'center'} gap={{base:2,md:10}} align={'flex-start'}>
            {/* a parent stack to make Location and details in one line */}
          <Stack> 
               {/* details stack */}
              <Stack w={{base:'100vw',md:"50vw", lg:"50vw"}} mt="8" p="6" bg="white" boxShadow="lg" borderRadius="md" spacing="4">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter listing title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter listing description"
              />
            </FormControl>


            <FormControl isRequired>  
              <FormLabel>Price</FormLabel>
                <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter listing price"
                />
            </FormControl>
           

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select listing category"
              >
                <option value="car">Car</option>
                <option value="hostel">Hostel</option>
                <option value="house">House</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Price Unit</FormLabel>
              <Select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="Select price unit"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
              </Select>
            </FormControl>

            {/* facilities section with bedrooms and bathrooms for House and Hostels */}

            {
              category && (category === 'house' || category === 'hostel') && (
                <>
                <FormControl isRequired>
                  <FormLabel FormLabel>Bedrooms</FormLabel>
                    <HStack maxW="200px">
                      <Button onClick={() => setFacilities((prev) => ({ ...prev, bedrooms: Math.max(prev.bedrooms - 1, 0) }))}>-</Button>
                        <Text>{facilities.bedrooms}</Text>
                      <Button onClick={() => setFacilities((prev) => ({ ...prev, bedrooms: prev.bedrooms + 1 }))}>+</Button>
                    </HStack>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Bathrooms</FormLabel>
                    <HStack maxW="200px">
                      <Button onClick={() => setFacilities((prev) => ({ ...prev, bathrooms: Math.max(prev.bathrooms - 1, 0) }))}>-</Button>
                      <Text>{facilities.bathrooms}</Text>
                      <Button onClick={() => setFacilities((prev) => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}>+</Button>
                    </HStack>
                  </FormControl>

                </>

              )
            }

            {/* Amenities Section */}

            {
             category && category !== 'car' && (

            <FormControl>
              <FormLabel>Amenities</FormLabel>
              {formData.amenities.map((amenity, index) => (
                <Flex key={index} mb={2}>
                  <Input
                    value={amenity}
                    onChange={(e) => handleAmenityChange(index, e.target.value)}
                    placeholder={`Amenity ${index + 1}`}
                    mr={2}
                  />
                  <Button onClick={() =>
                    setFormData({
                      ...formData,
                      amenities: formData.amenities.filter((_, i) => i !== index),
                    })
                  }>
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button onClick={handleAddAmenity}>Add Amenity</Button>
            </FormControl>
              )
            }
            

            {/* Rules Section */}
            <FormControl>
              <FormLabel>Rules</FormLabel>
              {formData.rules.map((rule, index) => (
                <Flex key={index} mb={2}>
                  <Input
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    mr={2}
                  />
                  <Button onClick={() =>
                    setFormData({
                      ...formData,
                      rules: formData.rules.filter((_, i) => i !== index),
                    })
                  }>
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button onClick={handleAddRule}>Add Rule</Button>
            </FormControl>
              </Stack>
              
              {/* location stack */}
              <Stack w={{base:'100vw',md:"50vw", lg:"50vw"}} mt="2" p="6" boxShadow="lg" borderRadius="md" bg={'white'}>
                <LocationSearch onLocationSelect={handleLocationSelect}/>
              </Stack>

          </Stack>

           {/* image and biddding stack */}
          <Stack w={{base:'100vw',md:"50vw", lg:"30vw"}} mt={{base:2, md:8}} p="6" boxShadow="lg" borderRadius="md" bg={'white'}>
            <FormControl>
              <FormLabel>Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                border="none"
                p="2"
              />
            </FormControl>

            {/* Preview of uploaded images */}
            <Box mt={4} display="flex" flexWrap="wrap" gap={4}>
              {imagePreviews.map((src, index) => (
                <Box key={index} boxSize="100px" overflow="hidden" borderRadius="md">
                  <Image src={src} alt={`preview ${index}`} objectFit="cover" />
                </Box>
              ))}
            </Box>

            <FormControl>
              <FormLabel>Videos</FormLabel>
              <Input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                border="none"
                p="2"
              />
            </FormControl>



            <Box className="mb-8" borderWidth={1} borderRadius="md" p={4} mt={4}>
              <Heading size="md">Bidding</Heading>
              <Flex alignItems="center" mt={2}>
                <Switch 
                  id="bidding" 
                  isChecked={formData.biddingEnabled}
                  onChange={handleBiddingToggle}
                  colorScheme='orange'
                />
                <FormLabel htmlFor="bidding" ml={2}>Enable Bidding</FormLabel>
              </Flex>
              {formData.biddingEnabled && (
                <Stack spacing={4} mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="minimumBid">Minimum Bid Amount</FormLabel>
                    <Input 
                      id="minimumBid" 
                      type="number" 
                      value={formData.minimumBid} 
                      onChange={(e) => setFormData({ ...formData, minimumBid: e.target.value })} 
                      placeholder="Enter minimum bid amount" 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bidIncrement">Bid Increment</FormLabel>
                    <Input 
                      id="bidIncrement" 
                      type="number" 
                      value={formData.bidIncrement} 
                      onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })} 
                      placeholder="Enter bid increment value" 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bidEndDate">Bid End Date</FormLabel>
                    <Input 
                      id="bidEndDate" 
                      type="datetime-local" 
                      value={formData.bidEndDate} 
                      onChange={(e) => setFormData({ ...formData, bidEndDate: e.target.value })} 
                    />
                  </FormControl>
                </Stack>
              )}
            </Box>

            <Button variant={'customButton'} type="submit" mt={4}>
              Create Listing
            </Button>
          </Stack>
          
        </Flex>
      </form>
    </Flex>
  );
}
