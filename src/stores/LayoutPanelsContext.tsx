import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type LayoutPanelsContextType = {
  quickSearchPanel: boolean;
  notificationsPanel: boolean;
  switchAccountPanel: boolean;
  setQuickSearchPanel: (value: boolean) => void;
  setNotificationsPanel: (value: boolean) => void;
  setSwitchAccountPanel: (value: boolean) => void;
};

const LayoutPanelsContext = createContext<LayoutPanelsContextType | undefined>(
  undefined
);

export const LayoutPanelsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [quickSearchPanel, setQuickSearchState] = useState(false);
  const [notificationsPanel, setNotificationsState] = useState(false);
  const [switchAccountPanel, setSwitchAccountState] = useState(false);

  const setQuickSearchPanel = (newValue: boolean) => {
    setQuickSearchState(newValue);
  };

  const setNotificationsPanel = (newValue: boolean) => {
    setNotificationsState(newValue);
  };

  const setSwitchAccountPanel = (newValue: boolean) => {
    setSwitchAccountState(newValue);
  };

  //NOTE: useMemo is used here because every render creates a new object: <SidebarMenuContext.Provider value={{ compactMenu, compactMenuOnHover, ...}}>
  const contextValue = useMemo(
    () => ({
      quickSearchPanel,
      notificationsPanel,
      switchAccountPanel,
      setQuickSearchPanel,
      setNotificationsPanel,
      setSwitchAccountPanel,
    }),
    [quickSearchPanel, switchAccountPanel, notificationsPanel]
  );

  return (
    <LayoutPanelsContext.Provider value={contextValue}>
      {children}
    </LayoutPanelsContext.Provider>
  );
};

export const useLayoutPanels = () => {
  const context = useContext(LayoutPanelsContext);
  if (!context)
    throw new Error(
      "useLayoutPanels must be used within a LayoutPanelsContextProvider"
    );
  return context;
};
