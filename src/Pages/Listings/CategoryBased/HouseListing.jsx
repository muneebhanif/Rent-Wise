import React, { useEffect, useState } from 'react'
import { getAllHouse } from '../../../Api/Home';
import { Box, Card, CardFooter, CardHeader, Heading, Input,Button, Flex, Text, SimpleGrid, Checkbox,Skeleton,Stack,Slider, SliderTrack, SliderFilledTrack, SliderThumb, } from '@chakra-ui/react';
import { Bath, BedDouble, CircleDollarSign, DollarSign, MapPin } from 'lucide-react';
import {Link} from 'react-router-dom'
import Loader from '../../../components/Style/Loader';

export default function HouseListing() {
  const [priceRange, setPriceRange] = useState([0, 1500000])
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
   const [houseData, setHouseData] = useState([]);
   const [amenity, setAmenity] = useState([]);
  const [bedrooms, setBedrooms] = useState(0)
  const [bathrooms, setBathrooms] = useState(0)
  const [loading, setLoading] = useState(true);
   const [selectedCities, setSelectedCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  // const [hasGarage, setHasGarage] = useState(false)
  // const [hasGarden, setHasGarden] = useState(false)

  const amenitiesList = [
    "WiFi", "Pool", "Parking", "Gym", "Air Conditioning", 
    "Pet Friendly", "Balcony", "Laundry", "Security", "Garden"
  ];

  useEffect(()=>{
        const fetchCarListings = async()=>{
          try {
            const response = await getAllHouse();
            setHouseData(response?.data?.data);
            
          } catch (error) {
            console.log(error);
          } finally {
              setLoading(false);
        
          }
         
        }
        fetchCarListings();
  
    },[])

    const handleMinChange = (e) => {
      const value = Number(e.target.value);
      if (value <= maxPrice) setMinPrice(value);
    };

    const handleMaxChange = (e) => {
      const value = Number(e.target.value);
      if (value >= minPrice) setMaxPrice(value);
    };

    const handleAmenityChange = (selectedAmenity) => {
      setAmenity((prev) =>
        prev.includes(selectedAmenity)
          ? prev.filter((item) => item !== selectedAmenity) // Remove if already selected
          : [...prev, selectedAmenity] // Add if not selected
      );
    };

    const filteredListings = houseData.filter(
      (house) =>
        house.price >= minPrice &&
        house.price <= maxPrice &&
        house?.facilities?.bedrooms >= bedrooms &&
        house?.facilities?.bathrooms >= bathrooms &&
        amenity.every((selectedAmenity) => // every returns boolean, if all conditions are true, it returns true, if any is false it returns false
          house?.amenities
            ?.map((a) => a.toLowerCase())
            .includes(selectedAmenity.toLowerCase())
        )&&
      (selectedCities.length > 0 ? selectedCities.includes(house?.location?.city) : true) &&
      (selectedStates.length > 0 ? selectedStates.includes(house?.location?.state) : true)
    );


  
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-2xl sm:text-2xl xl:text-4xl font-bold mb-8 text-center text-orange-600">Discover Your Dream Home</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full lg:w-1/4">
          <Card  border={'1px solid #E0E0E0'}>
            {/* <CardHeader className="bg-orange-500 text-white">
              <Heading>Find Your Perfect House</Heading>
            </CardHeader> */}
            <Box p={6}>
              <div>
                <Flex flexDir={'column'} gap={3} mb={5}>
                <label htmlFor="price" className="text-orange-800 font-semibold">Price Range</label>
                


    <Slider
      aria-label="price-slider"
      min={minPrice}
      max={10000000}
      step={500}
      value={maxPrice}
      onChange={(value) => setMaxPrice(value)}
    >
      <SliderTrack bg="gray.300">
        <SliderFilledTrack bg="orange.500" />
      </SliderTrack>

      <SliderThumb boxSize={6} bg="orange.500">
       <CircleDollarSign  color="white" />
      </SliderThumb>
    </Slider>

                </Flex>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <Input
          type="number"
          value={minPrice}
          onChange={handleMinChange}
          min="0"
          max="10000000"
          style={{ width: "45%", padding: "5px" }}
          placeholder="Min Price"
        />
        <Input
          type="number"
          value={maxPrice}
          onChange={handleMaxChange}
          min="0"
          max="10000000"
          style={{ width: "45%", padding: "5px" }}
          placeholder="Max Price"
        />
      </div>
              </div>
              <div>
                <label htmlFor="bedrooms" className="text-orange-800 font-semibold">Minimum Bedrooms</label>
                <Input 
                  type="number" 
                  id="bedrooms" 
                  value={bedrooms} 
                  onChange={(e) => setBedrooms(e.target.value === "" ? 0 : parseInt(e.target.value))}
                  min={0}
                  className="mt-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label htmlFor="bathrooms" className="text-orange-800 font-semibold">Minimum Bathrooms</label>
                <Input 
                  type="number" 
                  id="bathrooms" 
                  value={bathrooms} 
                  onChange={(e) => setBathrooms(e.target.value === "" ? 0 : parseInt(e.target.value))}
                  min={0}
                  className="mt-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Flex flexDir="column"  mb={5}>
                  <Text fontWeight="semibold" mb={2} color="orange.800">
                   Amenities
                  </Text>
                  <SimpleGrid columns={[2, 1]} spacing={3}>
                    {amenitiesList.map((amenities, index) => (
                      <Checkbox key={index} colorScheme="orange" value={amenity}
                      onChange={() => handleAmenityChange(amenities)}
                      isChecked={amenity.includes(amenities)}
                       >
                        {amenities}
                      </Checkbox>
                    ))}
                 </SimpleGrid>
                </Flex>

                    <Flex flexDir="column" gap={2} mb={5}>
                      <label className="text-orange-800 font-semibold">Filter by City</label>
                      {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", "Quetta", "Multan", "Faisalabad"].map((city) => (
                        <Checkbox
                        colorScheme='orange'
                          key={city}
                          isChecked={selectedCities.includes(city)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCities([...selectedCities, city]);
                            } else {
                              setSelectedCities(selectedCities.filter((c) => c !== city));
                            }
                          }}
                        >
                          {city}
                        </Checkbox>
                      ))}
                    </Flex>
                
                    {/* State (Province) Filter */}
                    <Flex flexDir="column" gap={2} mb={5}>
                      <label className="text-orange-800 font-semibold">Filter by Province</label>
                      {["Sindh", "Punjab", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir"].map((state) => (
                        <Checkbox
                        colorScheme='orange'
                          key={state}
                          isChecked={selectedStates.includes(state)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStates([...selectedStates, state]);
                            } else {
                              setSelectedStates(selectedStates.filter((s) => s !== state));
                            }
                          }}
                        >
                          {state}
                        </Checkbox>
                      ))}
                    </Flex>
             
            </Box>
          </Card>
        </div>

        {/* Main content area with listings */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
            {filteredListings.map(house => (
              <Card key={house._id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white">
                {
                  house?.images.length > 0 ? (
                    <img  src={
                      `${import.meta.env.VITE_BACK_END_URL}${house?.images[0]?.url}` ||
                      '/images/make_listing/random.png'
                    } alt={house.title} className="w-full h-48 object-cover" />  
                  ) : (
                    <img  src={
                      `/images/make_listing/random.png`
                    } alt={house.title} className="w-full h-48 object-cover" />  
                  ) 
                }
                <Box px={2}>
                <Heading py={2} fontSize={'20px'} fontWeight={'semibold'}>{house.title}</Heading>
                  <Flex gap={1} alignItems={'baseline'}>
                    <span className="text-[20px] font-bold mb-2 flex items-center text-orange-500">{house.price.toLocaleString()} PKR</span>
                    <span className="text-gray-600">/{house.priceUnit}</span>
                  </Flex>
                  
                  <div className="flex justify-between items-center mb-2 text-orange-700">
                    <span className="flex items-center">
                      <BedDouble className="w-5 h-5 mr-1" /> {house?.facilities?.bedrooms || 0}
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-5 h-5 mr-1" /> {house?.facilities?.bathrooms || 0}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 text-orange-500 mr-1" /> {house?.location?.city || house?.location?.state || house?.location?.country || 'Unknown Location'}
                  </p>
                  <Flex my={2} gap={2} >
                  {house?.amenities?.slice(0, 4).map((item, i) => (
                    <Text 
                     textAlign={'center'}
                     alignContent={'center'}
                      borderRadius="10px" 
                      px={3} 
                      py="2px"  
                      bg="gray.100" 
                      color="gray.800" 
                      fontWeight="semibold" 
                      fontSize="13px" 
                      key={i}
                    >
                      {item}
                    </Text>
                  ))}
                </Flex>
                </Box>
                <CardFooter>
                  <Button as={Link} to={`/rental/${house._id}`} variant={'cutomButton'} className="w-full bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredListings.length === 0 && (
            <Card className="p-8 text-center bg-white">
              <p className="text-orange-800 text-xl">No listings found matching your criteria.</p>
              <p className="text-gray-600 mt-2">Try adjusting your filters to see more results.</p>
            </Card>
          )}

     {loading && 
        (  
       <Loader/>

       )
     }
        </div>
      </div>
    </div>
  )
}


