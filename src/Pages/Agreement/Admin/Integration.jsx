import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Web3 from 'web3';
import { MakeAggrementForAdminByOwnerIDs } from '../../../Api/Blockchain';

const Integration = ({agreementId,agreementDetails, setAgreementDetails}) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          } else {
            console.error('No accounts found. Please connect your MetaMask wallet.');
          }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    const handleSubmit = async () => {
      if (!agreementId) {
        console.error('Agreement ID is missing');
        return;
      }

      if (typeof window.ethereum !== 'undefined' && currentAccount) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3 = new Web3(window.ethereum);
          const contractAddress = '0xa9A58C79fE35a675577ACd9144643BbB63e7585C'; // Replace with your contract address
          const contractABI = [
            {
              inputs: [],
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'string',
                  name: 'agreementId',
                  type: 'string',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'creator',
                  type: 'address',
                },
              ],
              name: 'AgreementCreated',
              type: 'event',
            },
            {
              inputs: [
                {
                  internalType: 'string',
                  name: '_agreementId',
                  type: 'string',
                },
              ],
              name: 'createAgreement',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'agreementId',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'owner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ];

          const rentalContract = new web3.eth.Contract(contractABI, contractAddress);

          // Send transaction
          const tx = await rentalContract.methods.createAgreement(agreementId).send({ from: currentAccount });
        

          // Fetch contract details
          const owner = await rentalContract.methods.owner().call();
           setTransactionHash(tx.transactionHash)

          setAgreementDetails({ owner, agreementId });
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        console.error('Ethereum provider is not available or account not set');
      }
    };

    if (currentAccount) {
      handleSubmit();
    }
  }, [currentAccount, agreementId]);

  useEffect(()=>{

    const ChangeStatus = async()=>{
      try{

        if(agreementId && transactionHash !== '')
          {
            const response = await MakeAggrementForAdminByOwnerIDs({agreementId,transactionHash});
          }
      }
      catch(error)
      {
        console.log('error', error);
      }
    }

    ChangeStatus();
   
    
  },[agreementId,transactionHash])

  return (
    <div>
      {
        agreementId && transactionHash!=='' && (
           <Link target="_blank" style={{fontSize:'24px', color:'blue', fontWeight:'bold'}} to={`https://sepolia.etherscan.io/tx/${transactionHash}`}>CLick Here to track Transaction </Link> 
        )
      }
      {currentAccount ? (
        <h4>Connected Account: {currentAccount}</h4>
      ) : (
        <h4>Please connect your MetaMask wallet</h4>
      )}

      {agreementDetails && (
        <div>
          <h4>Agreement Created Successfully!</h4>
          <p>
            <strong>Owner:</strong> {agreementDetails.owner}
          </p>
          <p>
            <strong>Agreement ID:</strong> {agreementDetails.agreementId}
          </p>
         
        </div>
      )}
    </div>
  );
};

export default Integration;
