import { GetAggreementsByID } from "../../../Api/Agreement";
import {
  Box,
  Heading,
  Input,
  Text,
  VStack,
  ListItem,
  OrderedList,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useAuth } from "../../../hooks/AuthContext";
import PopOverRenterConfirm from "./PopOverRenterConfirm";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ColorTubeLoader from "../../../components/Style/ColorTubeLoader";

export default function ViewHostelAgr() {
  const { user } = useAuth();
  const [ownerConfirmed, setOwnerConfirmed] = useState(true);
  const [renterConfirmed, setRenterConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [renterDetails, setRenterDetails] = useState("");
  const [ownerDetail, setOwnerDetail] = useState("");
  const [popOver, SetPopOver] = useState(false);
  const [listName, setListName] = useState('');
  const [formData, setFormData] = useState({
    createdDate: "",
    rentAmount: "",
    startDate: "",
    endDate: "",
    duration: "",
    timePeriod: "",
    advanceRent: "",
    advanceRentMonths: "",
    securityDeposit: "",
    securityDepositMonths: "",
    rentIncreasePercentage: "",
    monthlyDueDate: "",
    agreementPoints: [],
  });
  const { _id } = useParams();

  useEffect(() => {
    const fetchSpecificAgreementDetail = async () => {
      try {
        if (!user || !_id) return;

        const response = await GetAggreementsByID(_id);
        setListName(response?.data?.data?.listingId?.title);

        const aggrDetail =
          response.data?.data?.agreementDetailsId?.aggrementDetail;
        setFormData({
          ...formData,
          createdDate: aggrDetail.createdDate,
          rentAmount: aggrDetail.rentAmount,
          startDate: aggrDetail.startDate,
          endDate: aggrDetail.endDate,
          duration: aggrDetail.duration,
          timePeriod: aggrDetail.timePeriod,
          advanceRent: aggrDetail.advanceRent,
          advanceRentMonths: aggrDetail.advanceRentMonths,
          securityDeposit: aggrDetail.securityDeposit,
          securityDepositMonths: aggrDetail.securityDepositMonths,
          rentIncreasePercentage: aggrDetail.rentIncreasePercentage,
          monthlyDueDate: aggrDetail.monthlyDueDate,
          agreementPoints: Array.isArray(aggrDetail.agreementPoints)
            ? aggrDetail.agreementPoints.map((point) => ({ ...point }))
            : [],
        });

        setRenterDetails(response.data.data.renterId);
        setOwnerDetail(response.data.data.ownerId);

        setOwnerConfirmed(response.data?.data?.ownerConfirmed);
        setRenterConfirmed(response.data?.data?.renterConfirmed);
      } catch (error) {
        console.log("Error fetching hostel agreement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecificAgreementDetail();
  }, [_id, user]);

  const SetRenterStatus = () => {
    setRenterConfirmed((prev) => !prev);
    SetPopOver(true);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <ColorTubeLoader />
      </Flex>
    );
  }

  return (
    <div>
      <Box
        maxW="4xl"
        mx="auto"
        p={6}
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
      >
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Hostel Rental Agreement
        </Heading>
        <VStack spacing={4} align="start" fontSize="sm">
          <Text>
            This rent agreement is being created, on this day of
            <Input
              type="date"
              name="createdDate"
              value={formData.createdDate}
              display="inline-block"
              w="40"
              mx={2}
            />
            date.
          </Text>

          <Text fontWeight="bold">BETWEEN</Text>
          {ownerDetail?.name && (
            <Text fontWeight={'semibold'} borderBottom={"1px solid gray"}>
              {ownerDetail?.name}
            </Text>
          )}

          <Text>Hereinafter known as the "landlord" of the one part.</Text>

          <Text fontWeight="bold">AND</Text>

          <Text fontWeight={'semibold'} borderBottom={"1px solid gray"}>
            {renterDetails?.name || ""}
          </Text>

          <Text>Hereinafter known as the 'tenant' of the other part.</Text>

          <Text>
            Whereas the landlord confirms that he is legally competent to rent
            out <span style={{ fontWeight:'600',borderBottom:"1px solid gray"}}>{listName}</span> with necessary
            electrical fittings and fixtures therein. The landlord has agreed to
            rent and the other party has agreed to accept the rent of said
            hostel.
          </Text>

          <Text fontWeight="bold">
            NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-
          </Text>

          <OrderedList spacing={2}>
            <ListItem>
              That the payment due each month for the hostel will be Rs.
              <Input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                display="inline-block"
                w="32"
                mx={2}
              />
              .
            </ListItem>
            <ListItem>
              That the duration for the contract shall be
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                display="inline-block"
                w="32"
                mx={2}
              />
              <Input
                type="text"
                name="timePeriod"
                value={formData.timePeriod}
                display="inline-block"
                w="32"
                mx={2}
              />
              The agreement shall initiate from
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                display="inline-block"
                w="40"
                mx={2}
              />
              and expire on
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                display="inline-block"
                w="40"
                mx={2}
              />
              .
            </ListItem>
            <ListItem>
              That the hostel will not be sublet and will not be used for
              illegal activities or any other reason but 'Residential" use only.
            </ListItem>
            <ListItem>
              That the Landlord has received from the tenant a sum of Rs.
              <Input
                type="number"
                name="advanceRent"
                value={formData.advanceRent}
                display="inline-block"
                w="32"
                mx={2}
              />
              being the
              <Input
                type="number"
                name="advanceRentMonths"
                value={formData.advanceRentMonths}
                display="inline-block"
                w="20"
                mx={2}
              />
              month's advance rent and Rs.
              <Input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                display="inline-block"
                w="32"
                mx={2}
              />
              being the
              <Input
                type="number"
                name="securityDepositMonths"
                value={formData.securityDepositMonths}
                display="inline-block"
                w="20"
                mx={2}
              />
              month's Security Fixed Deposit.
            </ListItem>
            <ListItem>
              That the Tenant will submit the monthly due rent to the
              hostel owner/Landlord on or before the date
              <Input
                type="number"
                name="monthlyDueDate"
                value={formData.monthlyDueDate}
                display="inline-block"
                w="20"
                mx={2}
              />
              of every calendar month till the expiry of the rent agreement.
            </ListItem>

            <ListItem>
              That both parties involved in the agreement have decided to
              increase
              <Input
                type="number"
                name="rentIncreasePercentage"
                value={formData.rentIncreasePercentage}
                display="inline-block"
                w="20"
                mx={2}
              />
              % rent every year.
            </ListItem>
            {formData?.agreementPoints?.map((point, index) => (
              <ListItem key={point.id}>
                <Text>{point.text}</Text>
              </ListItem>
            ))}
          </OrderedList>

          <Text>
            In witness whereof, the parties named above have ascribed their
            hands hereto legitimise this agreement and the date mentioned
          </Text>
          {ownerConfirmed ? (
            <Text
              color={"green.600"}
              fontWeight={"bold"}
              fontSize={"lg"}
            >{`${ownerDetail?.name} confirmed this agreement`}</Text>
          ) : (
            <Text
              color={"red.600"}
              fontWeight={"bold"}
              fontSize={"lg"}
            >{`${ownerDetail?.name} not confirmed this agreement`}</Text>
          )}

          <Flex gap={4} mt={4} flexDir={"column"}>
            {renterConfirmed ? (
              <Text
                color={"green.600"}
                fontWeight={"bold"}
                fontSize={"lg"}
              >{`${renterDetails?.name} confirmed this agreement`}</Text>
            ) : (
              <Text
                color={"red.600"}
                fontWeight={"bold"}
                fontSize={"lg"}
              >{`${renterDetails?.name} not confirmed this agreement`}</Text>
            )}

            {renterDetails?._id === user?._id && !renterConfirmed && (
                          <Button
                            w={"fit-content"}
                            onClick={SetRenterStatus}
                            bg={"black"}
                            color={"white"}
                          >
                            {renterConfirmed ? (
                              <Text>I dont agree to this agreemnt</Text>
                            ) : (
                              <Text>I agree to this agreement</Text>
                            )}
                          </Button>
                        )}
                        
            {renterDetails?._id === user?._id && renterConfirmed && popOver && (
                          <PopOverRenterConfirm
                            aggId={_id}
                            renterConfirmed={renterConfirmed}
                            setRenterConfirmed={setRenterConfirmed}
                          />
                        )}
          </Flex>
        </VStack>
      </Box>
    </div>
  );
}
