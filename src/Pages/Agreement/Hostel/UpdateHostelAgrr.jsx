// updating hostel agreement

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from '../../../hooks/AuthContext';
import { GetAggreementsByID, UpdateAggrementByOwner } from '../../../Api/Agreement';
import HostelAgrTemplate from './HostelAgrTemplate'; 
import { useToast } from "@chakra-ui/react";

export default function UpdateHostelAgrr() { 

  const { user } = useAuth();
  const toast = useToast();

  const [aggrementDetail, setAggrementDetail] = useState({
    place: "",
    timeInDayCount: "",
    rentAmount: "",
  });
  const [ownerConfirmed, setOwnerConfirmed] = useState(true); // done
  const [renterConfirmed, setRenterConfirmed] = useState(false); // done
  const [renterDetails, setRenterDetails] = useState(""); // done
  const [ownerDetail, setOwnerDetail] = useState(""); // done
  const [listingDetail, setListingDetail] = useState([]); // done
  const [checkCreateAgrr, setCheckCreateAggr] = useState(true);
  const [mainDetails, setMainDetails] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchSpecificAgreementDetail = async () => {
      try {
        if (!user || !id) return;
        const response = await GetAggreementsByID(id);
        
        const aggrDetail =
          response.data?.data?.agreementDetailsId?.aggrementDetail;

        setMainDetails(response?.data?.data);

        setAggrementDetail({
          ...aggrementDetail,
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
            ? aggrDetail.agreementPoints.map((point) => ({
                ...point,
              }))
            : [],
        });

        setRenterDetails(response.data.data.renterId);
        setOwnerDetail(response.data.data.ownerId);
        setOwnerConfirmed(response.data?.data?.ownerConfirmed);
        setRenterConfirmed(response.data?.data?.renterConfirmed);
        setListingDetail(response.data?.data?.listingId);
      } catch (error) {
        console.log("errr", error);
      }
    };
    fetchSpecificAgreementDetail();
  }, [id, user]);

  const OwnerConfirmedFunc = async () => {
    setOwnerConfirmed(!ownerConfirmed);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAggrementDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAgreement = async () => {
    if (!aggrementDetail && !id) return;

    try {
      const data = ownerConfirmed;
      const response = await UpdateAggrementByOwner({
        aggrementDetail,
        data,
        aggId: id,
      });
    
      toast({
        title: "Agreement updated",
        description: "agreement details are updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div>
      <HostelAgrTemplate
        updateAgreement={updateAgreement}
        handleChange={handleChange}
        mainDetails={mainDetails}
        OwnerConfirmedFunc={OwnerConfirmedFunc}
        ownerConfirmed={ownerConfirmed}
        setAggrementDetail={setAggrementDetail}
        formData={aggrementDetail}
        setRenterDetails={setRenterDetails}
        tenant={renterDetails}
        checkCreateAgrr={checkCreateAgrr}
      />
    </div>
  );
}
