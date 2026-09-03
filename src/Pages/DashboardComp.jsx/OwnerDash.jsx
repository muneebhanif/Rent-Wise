import React, { useContext, useEffect, useRef, useState } from "react";
import {
  DollarSign,
  Users,
  Package,
  AlertCircle,
  BarChart2,
  Plus,
  Edit,
  Printer,
} from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  TableContainer,
} from "@chakra-ui/react";

// import { getAlListingsofSpecificUser } from "../../Api/ListingApi";
import { Link } from "react-router-dom";
import { ListingsContext } from "../../hooks/ListingsContext";
import { GetAggreements } from "../../Api/Agreement";
// import UserPopover from "./UserPopover";
// import UpdateAgreement from "../Agreement/UpdateAgreement";

export default function OwnerDash() {
  const [listingCount, setListingCount] = useState("");
  const [agreements, setAgreements] = useState([]);
  const [agreementCount, setAgreementCount] = useState("");
  const [agreementStatusCount, setAgreementStatusCount] = useState(null);

  const [showAllAggr, setShowAllAgrr] = useState(false);
  const [decideAggrNumber, setDecideAggrNumber] = useState([]);
  


   const [displayLimit, setDisplayLimit] = useState(2); // Initial limit of 5 listings
  const [showAll, setShowAll] = useState(false);
  const [decideListingNumber, setDecideListingNumber] = useState([]);
  const tableRef = useRef(null);

  const { state, dispatch } = useContext(ListingsContext);
  const { userListings } = state;
  const totalRevenue = agreements.reduce((total, agreement) => {
    const details = agreement?.agreementDetailsId?.aggrementDetail || {};
    const amount = Number(details.rentAmount ?? details.RentAmount ?? 0);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const activeRentalCount = agreements.filter(
    (agreement) => agreement.agreementStatus === "active"
  ).length;
  // const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await GetAggreements();
        
      console.log("Agreements in owner dashss",response.data.data);
        setAgreements(response.data.data);
        const aggrData = response?.data?.data;
        setDecideAggrNumber(showAllAggr ? aggrData : aggrData.slice(0, displayLimit))
        // agreement count
        setAgreementCount(response?.data?.data?.length);
        const AgrrStatus = response?.data?.data?.map(
          (item) => item.agreementStatus
        );
        const activeCount = AgrrStatus?.filter(
          (status) => status === "active"
        ).length;
        setAgreementStatusCount(activeCount);
      } catch (error) {
        console.error("Failed to fetch agreements:", error);
      }
    };

    fetchAgreements();
  }, [showAllAggr]);

  const handleEditClick = () => {
    setHandleAgreementEditClick(true);
  };

  

  useEffect(() => {
    setListingCount(userListings.length);
    setDecideListingNumber(showAll ? userListings : userListings.slice(0, displayLimit))

  }, [userListings, userListings.listingStatus, showAll]);

  const handleViewAllListings = () => {
    setShowAll(true);
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
    
  };
  const handleViewAllAgreements = () => {
    setShowAllAgrr(true);
   //  tableRef.current?.scrollIntoView({ behavior: "smooth" });
    
  };

  return (
    <Box minH="100vh" bg="whiteAlpha.800" p={{ base: 0, sm: 4, md: 8 }}>
      <Box maxW="7xl" mx="auto">
        <Flex justifyContent={"space-between"} mb={5}>
          <Heading
            as="h1"
            size={{ base: "md", sm: "lg", md: "xl" }}
            mb={{ base: 3, sm: 4, md: 8 }}
          >
            Owner Dashboard
          </Heading>
          {/* {
    listingCount && listingCount > 0 && (
    <Flex gap={3} alignItems={'center'}>

        <Text fontWeight={'bold'} fontSize={'lg'} >Create Aggreement</Text>
        <Printer onClick={ ()=> setPopover(prev => !prev) } size={40} color="#ff0000" />
         
    </Flex>
    )
} */}

          {/* {listingCount && listingCount > 0 && <UserPopover />} */}
        </Flex>

        <SimpleGrid
          columns={{ base: 2, sm: 2, lg: 4 }}
          spacing={{ base: 3, sm: 4, md: 6 }}
          mb={{ base: 3, sm: 4, md: 8 }}
        >
          <Card boxShadow={"2xl"}>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Total Revenue
                </Heading>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Text
                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                ${totalRevenue.toLocaleString()}
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                Based on {agreements.length} agreement{agreements.length === 1 ? "" : "s"}
              </Text>
            </CardBody>
          </Card>
          <Card boxShadow={"2xl"}>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Active Rentals
                </Heading>
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Text
                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                {activeRentalCount}
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                Currently active agreements
              </Text>
            </CardBody>
          </Card>
          <Card boxShadow={"2xl"}>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Listed Items
                </Heading>
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              {listingCount && listingCount > 0 ? (
                <Text
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  fontWeight="bold"
                >
                  {listingCount}
                </Text>
              ) : (
                <Text
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  fontWeight="bold"
                >
                  0
                </Text>
              )}
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                {listingCount || 0} total listing{listingCount === 1 ? "" : "s"}
              </Text>
            </CardBody>
          </Card>
          <Card boxShadow={"2xl"}>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Agreements Created
                </Heading>
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Box
                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                {agreementCount && agreementCount > 0 ? (
                  <Text>{agreementCount}</Text>
                ) : (
                  <Text fontSize={{base:'12px', sm:"20px"}}>No agreements created yet</Text>
                )}
              </Box>
              <Box fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                {agreementStatusCount && agreementStatusCount > 0 ? (
                  <Text>{agreementStatusCount} active agreements</Text>
                ) : (
                  <Text>No active agreements </Text>
                )}
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1 }} spacing={{ base: 3, sm: 4, md: 8 }}>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Heading as="h2" size={{ base: "xs", sm: "sm", md: "md" }}>
                Listings
              </Heading>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <TableContainer overflowX="auto" >
                <Table variant="simple" size={{ base: "sm", md: "md" }}>
                  <Thead>
                    <Tr>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Title</Th>

                      <Th fontSize={{ base: "xs", sm: "sm" }}>Category</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Status</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Price</Th>

                      <Th fontSize={{ base: "xs", sm: "sm" }}>Update</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {decideListingNumber &&
                      decideListingNumber.length > 0 &&
                      decideListingNumber.map((booking, index) => (
                        <Tr key={index}>
                          <Td
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="medium"
                          >
                            {booking.title}
                          </Td>

                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            {booking.category}
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            <Text
                              display="inline-flex"
                              alignItems="center"
                              px={2}
                              py={0.5}
                              rounded="full"
                              fontSize={{ base: "xs", sm: "sm" }}
                              fontWeight="medium"
                              // colorScheme={
                              //   booking.listingStatus === "active"
                              //     ? "green"
                              //     : booking.listingStatus === "Inactive"
                              //       ? "red"
                              //       : booking.listingStatus === "pending"
                              //         ? "yellow"
                              //         : booking.listingStatus === "Rented"
                              //           ? "blue"
                              //           : "gray"
                              // }
                              bg={
                                booking.listingStatus === "active"
                                  ? "green.100"
                                  : booking.listingStatus === "Inactive"
                                    ? "red.100"
                                    : booking.listingStatus === "pending"
                                      ? "yellow.100"
                                      : booking.listingStatus === "Rented"
                                        ? "blue.100"
                                        : "gray.100"
                              }
                              color={
                                booking.listingStatus === "active"
                                  ? "green.700"
                                  : booking.listingStatus === "Inactive"
                                    ? "red.700"
                                    : booking.listingStatus === "pending"
                                      ? "yellow.700"
                                      : booking.listingStatus === "Rented"
                                        ? "blue.100"
                                        : "gray.100"
                              }
                            >
                              {booking.listingStatus}
                            </Text>
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            {booking.price}
                          </Td>

                          <Td>
                            <Link to={`/listings/${booking._id}`}>
                              <Button
                                variant="ghost"
                                size={{ base: "xs", sm: "sm" }}
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </Link>
                          </Td>
                        </Tr>
                      ))} 
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter p={{ base: 2, sm: 3, md: 4 }} ref={tableRef}>
              {
                !showAll && userListings.length > displayLimit && (
                  <Button
                  variant={'dashboardButton'}
                    // bg={"rgb(41, 39, 39)"}
                    // color={"white"}
                    // _hover={{
                    //   color: "black",
                    //   background: "none",
                    //   border: "1px solid black",
                    // }}
                    // variant="outline"
                    width="full"
                    onClick={handleViewAllListings}
                    size={{ base: "xs", sm: "sm", md: "md" }}
                  >
                    View All Listings
                  </Button>
                )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Heading as="h2" size={{ base: "xs", sm: "sm", md: "md" }}>
                Agreement
              </Heading>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <TableContainer overflowX="auto">
                <Table variant="simple" size={{ base: "sm", md: "sm" }}>
                  <Thead>
                    <Tr>
                      {/* <Th fontSize={{ base: "xs", sm: "sm" }}>Agreement ID</Th> */}
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Title</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Category</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Status</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>
                        Owner Confirmed
                      </Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>
                        Renter Confirmed
                      </Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>
                        Start Date - End Date
                      </Th>

                      <Th fontSize={{ base: "xs", sm: "sm" }}>Update</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {decideAggrNumber && decideAggrNumber.length > 0 ? (
                      decideAggrNumber.map((agreement) => (
                        <Tr key={agreement._id}>
                          {/* <Td fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium">
                  {agreement.agreementDetailsId}
                </Td> */}
                          <Td
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="medium"
                          >
                            {agreement.listingId?.title}
                          </Td>
                          <Td
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="medium"
                          >
                            {agreement.listingId?.category}
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            <Text
                              display="inline-flex"
                              alignItems="center"
                              px={2}
                              py={1}
                              rounded="full"
                              fontSize={{ base: "xs", sm: "sm" }}
                              fontWeight="medium"
                              // colorScheme={
                              //   agreement.agreementStatus === "pending"
                              //     ? "orange"
                              //     : agreement.agreementStatus === "rejected"
                              //       ? "red"
                              //       : agreement.agreementStatus === "active"
                              //         ? "green"
                              //         : agreement.agreementStatus === "Inactive"
                              //           ? "gray"
                              //           : "blue"
                              // }
                              bg={
                                agreement.agreementStatus === "pending"
                                  ? "orange.100"
                                  : agreement.agreementStatus === "rejected"
                                    ? "red.100"
                                    : agreement.agreementStatus === "active"
                                      ? "green.100"
                                      : agreement.agreementStatus === "Inactive"
                                        ? "gray.100"
                                        : "blue.100"
                              }
                              color={
                                agreement.agreementStatus === "pending"
                                  ? "orange.700"
                                  : agreement.agreementStatus === "rejected"
                                    ? "red.700"
                                    : agreement.agreementStatus === "active"
                                      ? "green.700"
                                      : agreement.agreementStatus === "Inactive"
                                        ? "gray.600"
                                        : "blue.100"
                              }
                            >
                              {agreement.agreementStatus}
                            </Text>
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            {agreement.ownerConfirmed ? "Yes" : "No"}
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            {agreement.renterConfirmed ? "Yes" : "No"}
                          </Td>
                          <Td fontSize={{ base: "xs", sm: "sm" }}>
                            {agreement.agreementDetailsId?.aggrementDetail
                              ?.startDate
                              ? new Date(
                                agreement.agreementDetailsId.aggrementDetail.startDate
                              ).toLocaleDateString()
                              : ""}
                            {" - "}
                            {agreement.agreementDetailsId?.aggrementDetail
                              ?.endDate
                              ? new Date(
                                agreement.agreementDetailsId.aggrementDetail.endDate
                              ).toLocaleDateString()
                              : ""}
                          </Td>
                          <Td>
                          <Link
                            to={
                              agreement.listingId?.category === "car"
                               ? `/agreementCar/${agreement._id}`
                                : agreement.listingId?.category === "hostel"
                                ? `/agreementHostel/${agreement._id}`
                                : `/agreementHouse/${agreement._id}`
                            }
                          >
                              <Button
                                // onClick={ handleEditClick}
                                variant="ghost"
                                size={{ base: "xs", sm: "sm" }}
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </Link>

                            {/* {
                    handleAgreementEditClick &&  <UpdateAgreement agreement={agreement}/>
                  }
                   */}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={6} textAlign="center">
                          No agreements found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter p={{ base: 2, sm: 3, md: 4 }}>
              {
                !showAllAggr && agreements.length > displayLimit &&  (
                  <Button
                  variant={'dashboardButton'}
                   width="full"
                   size={{ base: "xs", sm: "sm", md: "md" }}
                   onClick={handleViewAllAgreements}
                 >
                   View All Agreements
                 </Button>
                )
              }
             
            </CardFooter>
          </Card>

          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Heading as="h2" size={{ base: "xs", sm: "sm", md: "md" }}>
                Performance Overview
              </Heading>
              <Text
                color="gray.500"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
              >
                Your rental performance for the last 30 days
              </Text>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Flex
                height={{ base: "100px", sm: "150px", md: "200px" }}
                align="center"
                justify="center"
                bg="gray.100"
                rounded="md"
              >
                <BarChart2 className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400" />
              </Flex>
            </CardBody>
            <CardFooter p={{ base: 2, sm: 3, md: 4 }}>
              <Button
               variant={'dashboardButton'}
                // bg={"rgb(41, 39, 39)"}
                // color={"white"}
                // _hover={{
                //   color: "black",
                //   background: "none",
                //   border: "1px solid black",
                // }}
                // variant="outline"
                width="full"
                size={{ base: "xs", sm: "sm", md: "md" }}
              >
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>

        <Box
          mt={{ base: 3, sm: 4, md: 8 }}
          display="flex"
          justifyContent="center"
        >
          <Link to={"/media"}>
            <Button
             variant={'dashboardButton'}
              // bg={"rgb(41, 39, 39)"}
              // color={"white"}
              // _hover={{
              //   color: "black",
              //   background: "none",
              //   border: "1px solid black",
              // }}
              leftIcon={<Plus className="h-3 w-3 sm:h-4 sm:w-4" />}
              // colorScheme="teal"
              size={{ base: "xs", sm: "sm", md: "md" }}
            >
              Add New Listing
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
