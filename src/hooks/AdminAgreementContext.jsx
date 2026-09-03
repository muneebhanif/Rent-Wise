
import { createContext, useContext, useState } from 'react';

const AgreementContext = createContext();

export const AgreementProvider = ({ children }) => {
  const [selectedAgreementId, setSelectedAgreementId] = useState(null);
  const [showIntegration, setShowIntegration] = useState(false);

  const deployAgreement = (id) => {
    setSelectedAgreementId(id);
    setShowIntegration(true);
  };

  const resetDeployment = () => {
    setSelectedAgreementId(null);
    setShowIntegration(false);
  };

  return (
    <AgreementContext.Provider
      value={{
        selectedAgreementId,
        showIntegration,
        deployAgreement,
        resetDeployment
      }}
    >
      {children}
    </AgreementContext.Provider>
  );
};

export const useAgreement = () => useContext(AgreementContext);
