import React, { useEffect, useState } from 'react'
import { getAllCar } from '../../../Api/Home';
import { Box, Card, CardFooter, CardHeader, Heading,
   Input, Slider,Button, Flex, Stack, Skeleton ,
    SliderTrack, SliderFilledTrack, SliderThumb,
    Checkbox
  } from '@chakra-ui/react';
import { Bath, BedDouble, CircleDollarSign, DollarSign, MapPin } from 'lucide-react';
import {Link} from 'react-router-dom'
import Loader from '../../../components/Style/Loader';

export default function CarListing() {
  const [priceRange, setPriceRange] = useState([0, 1500000])
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCities, setSelectedCities] = useState([]);
const [selectedStates, setSelectedStates] = useState([]);


 

  useEffect(()=>{
        const fetchCarListings = async()=>{
          try {
            const response = await getAllCar();
            setCarData(response?.data?.data);
            
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

    const filteredListings = carData.filter((car) => {
      const matchesPrice = car.price >= minPrice && car.price <= maxPrice;
      const matchesCity = selectedCities.length > 0 ? selectedCities.includes(car.location?.city) : true;
      const matchesState = selectedStates.length > 0 ? selectedStates.includes(car.location?.state) : true;
      return matchesPrice && matchesCity && matchesState;
    });
    
    


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-2xl xl:text-4xl font-bold mb-8 text-center text-orange-600">Discover Your Dream Cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full lg:w-1/4">
          <Card boxShadow={'lg'}>
            {/* <CardHeader className="bg-orange-500 text-white">
              <Heading>Find Your Perfect Car</Heading>
            </CardHeader> */}
    <Box p={6}>
  <div>
    <Flex flexDir="column" gap={3} mb={5}>
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
          <CircleDollarSign color="white" />
        </SliderThumb>
      </Slider>
    </Flex>
     {/* Price Min-Max Inputs */}
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

    {/* City Filter */}
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

   
  </div>
</Box>


          </Card>
        </div>

        {/* Main content area with listings */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map(car => (
              <Card key={car._id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white">
                {
                  car?.images.length > 0 ? (
                    <img  src={
                      `${import.meta.env.VITE_BACK_END_URL}${car?.images[0]?.url}` ||
                      '/images/make_listing/random.png'
                    } alt={car.title} className="w-full h-48 object-cover" />  
                  ) : (
                    <img  src={
                      `/images/make_listing/random.png`
                    } alt={car.title} className="w-full h-48 object-cover" />  
                  ) 
                }
                <Box px={2}>
                 <Heading py={2} fontSize={'20px'} fontWeight={'semibold'}>{car.title}</Heading>
                  <Flex gap={1} alignItems={'baseline'}>
                    <span className="text-[20px] font-bold mb-2 flex items-center text-orange-500">{car.price.toLocaleString()} PKR</span>
                    <span className="text-gray-600">/{car.priceUnit}</span>
                    </Flex>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 text-orange-500 mr-1" /> {car?.location?.city || car?.location?.state || car?.location?.country || 'Unknown Location'}
                  </p>
                </Box>
                <CardFooter>
                  <Button as={Link} to={`/rental/${car._id}`} variant={'cutomButton'} className="w-full bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
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


