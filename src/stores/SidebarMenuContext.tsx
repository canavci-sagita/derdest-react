import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type SidebarMenuContextType = {
  compactMenu: boolean | undefined;
  compactMenuOnHover: boolean;
  activeMobileMenu: boolean;
  setCompactMenu: (value: boolean) => void;
  setCompactMenuOnHover: (value: boolean) => void;
  setActiveMobileMenu: (value: boolean) => void;
};

const SidebarMenuContext = createContext<SidebarMenuContextType | undefined>(
  undefined
);

interface SidebarMenuProviderProps {
  children: ReactNode;
  initialCompactMenu: boolean;
}

export const SidebarMenuContextProvider = ({
  children,
  initialCompactMenu,
}: SidebarMenuProviderProps) => {
  const [compactMenu, setCompactMenuState] = useState(initialCompactMenu);
  const [compactMenuOnHover, setCompactMenuOnHoverState] = useState(false);
  const [activeMobileMenu, setActiveMobileMenuState] = useState(false);

  const setCompactMenu = (newValue: boolean) => {
    setCompactMenuState(newValue);
    localStorage.setItem(COOKIE_CONSTANTS.COMPACT_MENU, String(newValue));
  };

  const setCompactMenuOnHover = (newValue: boolean) => {
    setCompactMenuOnHoverState(newValue);
  };

  const setActiveMobileMenu = (newValue: boolean) => {
    setActiveMobileMenuState(newValue);
  };

  const contextValue = useMemo(
    () => ({
      compactMenu,
      compactMenuOnHover,
      activeMobileMenu,
      setCompactMenu,
      setCompactMenuOnHover,
      setActiveMobileMenu,
    }),
    [compactMenu, compactMenuOnHover, activeMobileMenu]
  );

  return (
    <SidebarMenuContext.Provider value={contextValue}>
      {children}
    </SidebarMenuContext.Provider>
  );
};

export const useSidebarMenu = () => {
  const context = useContext(SidebarMenuContext);
  if (!context)
    throw new Error(
      "useSidebarMenu must be used within a SidebarMenuContextProvider"
    );
  return context;
};
