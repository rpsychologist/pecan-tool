import React, { createContext, useReducer } from 'react';
import { reducer } from "../reducer"

const OnboardingContext = createContext();
export function OnboardingContextProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export default OnboardingContext