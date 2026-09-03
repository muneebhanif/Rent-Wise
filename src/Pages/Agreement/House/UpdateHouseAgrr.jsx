// updating house agreement

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from '../../../hooks/AuthContext';
import { GetAggreementsByID, UpdateAggrementByOwner } from '../../../Api/Agreement';
import HouseAgrTemplate from './HouseAgrTemplate';
import { useToast } from "@chakra-ui/react";

export default function UpdateHouseAgrr() {

     const { user } = useAuth();
     const toast = useToast();
    
      const [aggrementDetail, setAggrementDetail] = useState({
        place: "",
        timeInDayCount: "",
        rentAmount: "",
      });
      const [ownerConfirmed, setOwnerConfirmed] = useState(true); //done
      const [renterConfirmed, setRenterConfirmed] = useState(false); //done
      const [renterDetails, setRenterDetails] = useState(""); // done
      const [ownerDetail, setOwnerDetail] = useState(""); // done
      const [listingDetail, setListingDetail] = useState([]); //done
      const [checkCreateAgrr, setCheckCreateAggr] = useState(true);
      const [mainDetails, setMainDetails] = useState('');
      
    
      const { id } = useParams();
    
      useEffect(() => {
        const fetchSpecificAgreementDetail = async () => {
          try {
            if (!user) {
              return;
            }
            if (!id) {
              return;
            }
    
            const response = await GetAggreementsByID(id);
            setMainDetails(response?.data?.data);
            const aggrDetail =
              response.data?.data?.agreementDetailsId?.aggrementDetail;
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
                  ...point, // Keep existing fields in the object
              
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
        if (ownerConfirmed) {
          setOwnerConfirmed(false);
        } else {
          setOwnerConfirmed(true);
        }
      };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAggrementDetail((prev) => ({
          ...prev,
          [name]: value,
      }));
  };
  
  const updateAgreement = async()=>{
      if(!aggrementDetail && !id)
      {
        return;
      }
      try {
        const data = ownerConfirmed
        const response =  await UpdateAggrementByOwner({aggrementDetail,data,aggId:id}); 
        toast({
          title: "Agreement updated",
          description: "agreement details are updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log("error")
        
      } 
    }
    
  
  return (
    <div>
        <HouseAgrTemplate 
        updateAgreement={updateAgreement}
         handleChange={handleChange}
        mainDetails = {mainDetails}
        OwnerConfirmedFunc={OwnerConfirmedFunc} ownerConfirmed={ownerConfirmed} 
        setAggrementDetail={setAggrementDetail} formData={aggrementDetail} setRenterDetails={setRenterDetails}
         tenant={renterDetails} checkCreateAgrr={checkCreateAgrr}
           />
      
    </div>
  )
}
