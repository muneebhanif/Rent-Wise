// updating car agreement

import CarAgrTemplate from './CarAgrTemplate'
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from '../../../hooks/AuthContext';
import { GetAggreementsByID, UpdateAggrementByOwner } from '../../../Api/Agreement';
import { useToast } from '@chakra-ui/react';

export default function UpdateCarAgrr() {

     const { user } = useAuth();
    const toast = useToast()
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
            const aggrDetail = response.data?.data?.agreementDetailsId?.aggrementDetail || {};
            const value = (key) => aggrDetail[key] ?? "";
            setAggrementDetail({
              ...aggrementDetail,
    createdDate: value("createdDate"),
    startDate: value("startDate"),
    endDate: value("endDate"),
    advanceRent: value("advanceRent"),
    advanceRentMonths: value("advanceRentMonths"),
    securityDeposit: value("securityDeposit"),
    securityDepositMonths: value("securityDepositMonths"),
    rentIncreasePercentage: value("rentIncreasePercentage"),
    registrationNum: value("registrationNum"),
    make: value("make"),
    carModel: value("carModel"),
    engineNum: value("engineNum"),
    ChassisNum: value("ChassisNum"),
    RentAmount: value("RentAmount"),
    rentTime: value("rentTime"),
    installments: value("aggrDetail"),
    crossedChequeAmount: value("crossedChequeAmount"),
    oilChangeTime: value("oilChangeTime"),
    tuningTime: value("tuningTime"),
    meetingOwnerDate: value("meetingOwnerDate"),
    noticePeriod: value("noticePeriod"),
    agreementPoints: Array.isArray(aggrDetail.agreementPoints)
    ? aggrDetail.agreementPoints.map((point) => ({
        ...point, // Keep existing fields in the object
    
      }))
    : [],
 });
 setMainDetails(response?.data?.data);
           
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
      console.log("error", error)
      
    }

    
  }
  return (
    <div>
        <CarAgrTemplate 
        updateAgreement= {updateAgreement}
        handleChange={handleChange}
        mainDetails = {mainDetails}
        OwnerConfirmedFunc={OwnerConfirmedFunc} ownerConfirmed={ownerConfirmed}  
        setAggrementDetail={setAggrementDetail} formData={aggrementDetail} setRenterDetails={setRenterDetails}
         tenant={renterDetails} checkCreateAgrr={checkCreateAgrr}
           />
      
    </div>
  )
}
