// CONTEXT

import React, {createContext, useContext, useState} from 'react';

export const StoreContext = createContext<undefined>(undefined);

export const useStore = () => {
  return useContext(StoreContext);
};

export const BrainmathSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [brainmathstorieBackgroundMusic, setBrainmathstorieBackgroundMusic] =
    useState(false);
  const [brainmathstorieVibration, setBrainmathstorieVibration] =
    useState(false);

  const contextValues = {
    brainmathstorieBackgroundMusic,
    setBrainmathstorieBackgroundMusic,
    brainmathstorieVibration,
    setBrainmathstorieVibration,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};
