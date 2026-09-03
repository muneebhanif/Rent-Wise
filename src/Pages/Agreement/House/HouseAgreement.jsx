// creating house agreement

import React, { useEffect, useState } from 'react';
import { createAgreement } from '../../../Api/Agreement';
import HouseAgrTemplate from './HouseAgrTemplate';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';



export default function HouseAgreement({tenant, listId, list_Title, list_category, convoID}) {

const navigate = useNavigate();
 const toast = useToast();

 const [ownerConfirmed, setOwnerConfirmed] = useState(true);
  const [renterId, setRenterId] = useState("");
  const [formData, setFormData] = useState({
    createdDate: '',
    rentAmount: '',
    startDate: '',
    endDate: '',
    duration: '',
    timePeriod: '',
    advanceRent: '',
    advanceRentMonths: '',
    securityDeposit: '',
    securityDepositMonths: '',
    rentIncreasePercentage: '',
    monthlyDueDate: '',
    agreementPoints: [
      { id: 1, text: 'That the Tenant will allow the landlord or their authorised person to visit the property to view the condition at a 24-hours prior notification.' }, 
      { id: 2, text: 'That the Tenant will be responsible for maintaining the property in good condition and will hand over the possession of the property to the rightful owner upon termination of the rental agreement.' }, 
      { id: 3, text: 'That the residing Tenant will not make any changes, additions, and modifications to the said premises.' }, 
      { id: 4, text: 'That either party shall provide a four (04) week written notice to the other for the termination of the rental contract.' }, 
      { id: 5, text: 'That on the expiration of the contract duration , this rental agreement can be extended/renewed by a consensual agreement from both sides for any further period, the Tenant will give the vacant possession of the said property.' }, 
      { id: 6, text: 'That the Tenant will not be allowed to use the said property for any illegal activity or business.' }, 
      { id: 7, text: 'That the tenant will submit the due rent regularly for the tenancy period and shall be responsible for paying water, electricity, maintenance, and other bills. The photocopy of these bills shall be submitted to the landlord in due time.That the Tenant will not be allowed to use the said property for any illegal activity or business.' }, 
      { id: 8, text: 'Both the parties have finalised the contract by themselves after satisfaction and inspection of premises, including title documents and legal right of the landlord to rent as well as status and credentials of each other.' }, 
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
       
        navigate(`/agreementHouse/${agreementID}`)
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
    <HouseAgrTemplate  
     ownerConfirmed={ownerConfirmed}  handleChange={handleChange} saveAgreement={saveAgreement} formData={formData}
    listId={listId} list_Title= {list_Title} list_category={list_category} tenant={tenant} convoID = {convoID} />
    </>
  );
}