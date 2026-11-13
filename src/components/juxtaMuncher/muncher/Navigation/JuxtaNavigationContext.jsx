import { createContext, useContext } from "react";
import useJuxtaNavigation from "./useJuxtaNavigation";

const JuxtaNavigationContext = createContext(null);

export function JuxtaNavigationProvider({ children }) {
  const navigation = useJuxtaNavigation();

  return (
    <JuxtaNavigationContext.Provider value={navigation}>
      {children}
    </JuxtaNavigationContext.Provider>
  );
}

export function useJuxtaNavigationContext() {
  return useContext(JuxtaNavigationContext);
}
