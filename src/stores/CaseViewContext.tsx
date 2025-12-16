"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";

type ViewMode = "list" | "table";

interface CaseViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const CaseViewContext = createContext<CaseViewContextType | undefined>(
  undefined
);

/**
 * A custom hook to easily access the case view context.
 */
export const useCaseView = () => {
  const context = useContext(CaseViewContext);
  if (!context) {
    throw new Error("useCaseView must be used within a CaseViewProvider");
  }
  return context;
};

interface CaseViewProviderProps {
  children: ReactNode;
  initialViewMode: ViewMode;
}

/**
 * A provider component that manages the view state and makes it available to its children.
 */
export const CaseViewProvider = ({
  children,
  initialViewMode,
}: CaseViewProviderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  useEffect(() => {
    Cookies.set(COOKIE_CONSTANTS.CASES_VIEW_MODE, viewMode, { expires: 365 });
  }, [viewMode]);

  return (
    <CaseViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </CaseViewContext.Provider>
  );
};
