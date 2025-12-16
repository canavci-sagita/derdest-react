"use client";

import { useEffect, useState } from "react";
import type { ActionFormState } from "@/types/form.types";
import set from "set-value";

/**
 * Safely gets a nested value from an object using a dot-separated path.
 * Example: get(obj, "address.country")
 */
const get = (obj: unknown, path: string): unknown => {
  if (typeof path !== "string") return undefined;

  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export function useActionForm<TFormValues>(
  serverState: ActionFormState<TFormValues>,
  initialState: ActionFormState<TFormValues>
) {
  const [displayState, setDisplayState] =
    useState<ActionFormState<TFormValues>>(initialState);

  useEffect(() => {
    setDisplayState(serverState);
  }, [serverState]);

  /**
   * Accepts a string path (e.g., "address.country") and clears the nested error.
   */
  const clearFieldError = (fieldName: string) => {
    setDisplayState((prevState) => {
      if (!prevState.errors) return prevState;

      const newErrors = { ...prevState.errors };

      // 1. Clear the specific field's error
      set(newErrors, fieldName, undefined);

      // 2. Prune empty parent objects
      const pathParts = fieldName.split(".");
      if (pathParts.length > 1) {
        const parentPath = pathParts.slice(0, -1).join(".");
        const parentObj = get(newErrors, parentPath);

        if (typeof parentObj === "object" && parentObj !== null) {
          const record = parentObj as Record<string, unknown>;
          const keys = Object.keys(record);

          const isAllEmpty = keys.every((key) => {
            if (key === "_errors") {
              const errors = record._errors;
              return !Array.isArray(errors) || errors.length === 0;
            }
            return record[key] === undefined;
          });

          if (isAllEmpty) {
            set(newErrors, parentPath, undefined);
          }
        }
      }

      return { ...prevState, errors: newErrors };
    });
  };

  /**
   * Accepts a string path (e.g., "accountDetails.confirmPassword")
   * and sets a nested error message.
   */
  const setFieldError = (fieldName: string, message: string | string[]) => {
    const messages = Array.isArray(message) ? message : [message];

    setDisplayState((prevState) => {
      const newErrors = { ...prevState.errors };
      set(newErrors, `${fieldName}._errors`, messages);

      return {
        ...prevState,
        status: "error",
        errors: newErrors,
      };
    });
  };

  const clearFormMessage = () => {
    setDisplayState((prevState) => ({
      ...prevState,
      message: null,
    }));
  };

  return {
    displayState,
    setDisplayState,
    setFieldError,
    clearFieldError,
    clearFormMessage,
  };
}
