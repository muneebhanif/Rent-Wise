import React from 'react';
import {
  Badge, Box, Button, Checkbox, Collapse, Flex, Heading, Input,
  SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack,
  Stack, Text, useDisclosure,
} from '@chakra-ui/react';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad'];
const STATES = ['Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'];

function Section({ title, count, children }) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  return <Box borderTop="1px solid" borderColor="gray.100" pt={3}>
    <Button variant="ghost" w="full" justifyContent="space-between" px={1} onClick={onToggle} size="sm">
      <Text fontWeight="700" color="gray.700">{title}</Text>
      <Flex gap={2} align="center"><Badge colorScheme="orange">{count || 0}</Badge><Text>{isOpen ? '−' : '+'}</Text></Flex>
    </Button>
    <Collapse in={isOpen}><Box pt={2}>{children}</Box></Collapse>
  </Box>;
}

const toggle = (setter, value, checked) => setter(previous => checked
  ? [...new Set([...previous, value])]
  : previous.filter(item => item !== value));

export default function CategoryFilterPanel({
  resultCount, priceMax, minPrice, maxPrice, setMinPrice, setMaxPrice,
  selectedCities, setSelectedCities, selectedStates, setSelectedStates,
  bedrooms, setBedrooms, bathrooms, setBathrooms, amenity, setAmenity,
  amenitiesList = [], showRooms = false, onReset,
}) {
  const activeCount = (minPrice > 0 ? 1 : 0) + (maxPrice < priceMax ? 1 : 0)
    + selectedCities.length + selectedStates.length + (bedrooms || 0 > 0 ? 1 : 0)
    + (bathrooms || 0 > 0 ? 1 : 0) + amenity.length;
  const safeMax = Math.max(Number(priceMax) || 1, 1);
  return <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" p={{ base: 4, md: 5 }} boxShadow="sm" position={{ lg: 'sticky' }} top="5">
    <Flex justify="space-between" align="start" mb={1}>
      <Box><Heading size="md" color="gray.800">Filters</Heading><Text fontSize="sm" color="gray.500">{resultCount} matching listings</Text></Box>
      <Button size="sm" variant="link" colorScheme="orange" onClick={onReset} isDisabled={!activeCount}>Reset</Button>
    </Flex>
    {activeCount > 0 && <Text fontSize="xs" color="orange.600" mb={3}>{activeCount} filter{activeCount > 1 ? 's' : ''} applied</Text>}
    <Stack spacing={4}>
      <Section title="Price range" count={minPrice > 0 || maxPrice < safeMax ? 1 : 0}>
        <Slider min={0} max={safeMax} step={500} value={Math.min(maxPrice, safeMax)} onChange={value => setMaxPrice(Math.max(value, minPrice))} colorScheme="orange" mb={3}>
          <SliderTrack><SliderFilledTrack /></SliderTrack><SliderThumb />
        </Slider>
        <Flex gap={2}><Input type="number" min={0} value={minPrice} aria-label="Minimum price" onChange={e => setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice))} placeholder="Min PKR" />
          <Input type="number" min={0} max={safeMax} value={maxPrice} aria-label="Maximum price" onChange={e => setMaxPrice(Math.max(Math.min(Number(e.target.value) || 0, safeMax), minPrice))} placeholder="Max PKR" /></Flex>
      </Section>
      {showRooms && <Section title="Property size" count={(bedrooms > 0 ? 1 : 0) + (bathrooms > 0 ? 1 : 0)}>
        <SimpleGrid columns={2} gap={2}><Input type="number" min={0} value={bedrooms} onChange={e => setBedrooms(Number(e.target.value) || 0)} placeholder="Min bedrooms" aria-label="Minimum bedrooms" /><Input type="number" min={0} value={bathrooms} onChange={e => setBathrooms(Number(e.target.value) || 0)} placeholder="Min bathrooms" aria-label="Minimum bathrooms" /></SimpleGrid>
      </Section>}
      {amenitiesList.length > 0 && <Section title="Amenities" count={amenity.length}><SimpleGrid columns={{ base: 2, md: 1 }} spacing={2}>{amenitiesList.map(item => <Checkbox key={item} colorScheme="orange" isChecked={amenity.includes(item)} onChange={e => toggle(setAmenity, item, e.target.checked)}>{item}</Checkbox>)}</SimpleGrid></Section>}
      <Section title="City" count={selectedCities.length}><SimpleGrid columns={{ base: 2, md: 1 }} spacing={2}>{CITIES.map(city => <Checkbox key={city} colorScheme="orange" isChecked={selectedCities.includes(city)} onChange={e => toggle(setSelectedCities, city, e.target.checked)}>{city}</Checkbox>)}</SimpleGrid></Section>
      <Section title="Province" count={selectedStates.length}><Stack spacing={2}>{STATES.map(state => <Checkbox key={state} colorScheme="orange" isChecked={selectedStates.includes(state)} onChange={e => toggle(setSelectedStates, state, e.target.checked)}>{state}</Checkbox>)}</Stack></Section>
    </Stack>
  </Box>;
}
