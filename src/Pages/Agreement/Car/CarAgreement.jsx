// creating car agreement

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAgreement } from '../../../Api/Agreement';
import CarAgrTemplate from "./CarAgrTemplate";
import { useToast } from "@chakra-ui/react";


export default function CarAgreement({listId,list_Title,list_category, tenant, convoID}) {

const navigate = useNavigate();

 const [ownerConfirmed, setOwnerConfirmed] = useState(true);
  const [renterId, setRenterId] = useState("");
  const toast = useToast();
  const [formData, setFormData] = useState({
    createdDate: '',
    startDate: '',
    endDate: '',
    advanceRent: '',
    advanceRentMonths: '',
    securityDeposit: '',
    securityDepositMonths: '',
    rentIncreasePercentage: '',

    registrationNum:'',
    make:'',
    carModel:'',
    engineNum:'',
    ChassisNum:'',
    RentAmount:'',
    rentTime:'',
    installments:'',
    crossedChequeAmount:'',
    oilChangeTime:'',
    tuningTime:'',
    meetingOwnerDate:'',
    noticePeriod:'',
    agreementPoints: [
      { id: 1, text: 'The lessee will drive the car personally, holding a valid driving license.' }, 
      { id: 2, text: 'The lessee shall park the car securely at their residence or another guarded location when not in use.' }, 
      { id: 3, text: 'The cars condition shall remain as seen (accident-free, no scratches), and the lessee agrees to return it in the same state.' }, 
      { id: 4, text: 'If the lessee fails to pay the rent on time, the owner has the right to repossess the car.' }, 
      { id: 5, text: 'All traffic fines, penalties, or claims during the lease period shall be borne by the lessee.' }, 
      { id: 6, text: 'The lessee is fully liable for any damage to the car during the lease period and shall repair it at a workshop approved by the owner.' }, 
      
    ]
  });

  useEffect(() => {
    if (!list_Title || !list_category || !listId) return;
    setRenterId(tenant._id);
  }, [list_category, listId, list_Title, tenant]);

   const saveAgreement = async (e) => {
    e.preventDefault();

    try {
      
      if (!tenant || !listId) {
        return;
      }
     
      setRenterId(tenant._id);
      const data = await createAgreement({
        aggrementDetail:formData,
        renterId,
        ownerConfirmed,
        listingId: listId,
        conversationID: convoID,
      });
    
       const agreementID = data?.data?.data?._id
       navigate(`/agreementCar/${agreementID}`)
       toast({
        title: "Agreement Created",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.log("errorInAgreement creation is: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      
    }));
  };

  return (
    <>
    <CarAgrTemplate 
    ownerConfirmed={ownerConfirmed}
    handleChange={handleChange} saveAgreement={saveAgreement} formData={formData}
    listId={listId} list_Title= {list_Title} list_category={list_category} tenant={tenant} convoID = {convoID}
       />
    </>
  );
}
