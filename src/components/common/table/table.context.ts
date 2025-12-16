import { createContext, useContext } from "react";

export interface TableContextType {
  dark?: boolean;
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
  sm?: boolean;
}

export interface TheadContextType {
  variant?: "default" | "light" | "dark";
}

export const tableContext = createContext<TableContextType | undefined>(
  undefined
);
export const theadContext = createContext<TheadContextType | undefined>(
  undefined
);

export const useTableContext = () => {
  const context = useContext(tableContext);
  if (context === undefined) {
    throw new Error(
      "This component must be rendered as a child of a <Table> component"
    );
  }
  return context;
};

export const useTheadContext = () => {
  const context = useContext(theadContext);
  if (context === undefined) {
    throw new Error(
      "This component must be rendered as a child of a <Table.Thead> component"
    );
  }
  return context;
};
