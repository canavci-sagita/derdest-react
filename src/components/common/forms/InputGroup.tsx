"use client";

import React, { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

export const inputGroupContext = createContext<boolean>(false);

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface InputGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> & {
  Text: React.FC<InputGroupTextProps>;
} = ({ children, className, ...rest }) => {
  return (
    <inputGroupContext.Provider value={true}>
      <div {...rest} className={twMerge("flex", className)}>
        {children}
      </div>
    </inputGroupContext.Provider>
  );
};

const InputGroupText: React.FC<InputGroupTextProps> = ({
  children,
  className,
  ...rest
}) => {
  const inputGroup = useContext(inputGroupContext);

  return (
    <div
      {...rest}
      className={twMerge(
        "py-2 px-3 bg-slate-100 border shadow-sm border-slate-300/60 text-slate-600 dark:bg-darkmode-900/20 dark:text-slate-400",
        inputGroup &&
          "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r",
        className
      )}
    >
      {children}
    </div>
  );
};

InputGroupText.displayName = "InputGroup.Text";
InputGroup.Text = InputGroupText;

export default InputGroup;
