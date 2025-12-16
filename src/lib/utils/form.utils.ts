import type { ActionFormState, FieldErrors } from "@/types/form.types";
import z from "zod";

type ErrorNode = {
  _errors?: string[];
  [key: string]: unknown;
};

const isErrorNode = (value: unknown): value is ErrorNode =>
  typeof value === "object" && value !== null;

type ValidationResult<T> = {
  /** The raw form data, always included. */
  fields: Record<string, unknown>;
} & ( // NOTE: The '&' intersects the common `fields` with the unique parts below
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: FieldErrors<T>;
    }
);

/**
 * A generic factory function to create a default initial state for any form.
 */
export function createFormState<TFormValues>(): ActionFormState<TFormValues> {
  return {
    status: "idle",
    message: null,
  };
}

/**
 * A generic utility to validate FormData against a Zod schema.
 */
export const validateFormData = <T extends z.ZodTypeAny>(
  formData: FormData,
  schema: T
): ValidationResult<z.infer<T>> => {
  const rawData = Object.fromEntries(formData);
  const validationResult = schema.safeParse(rawData);

  if (validationResult.success) {
    return {
      success: true,
      fields: rawData,
      data: validationResult.data,
    };
  }

  return {
    success: false,
    errors: validationResult.error.flatten().fieldErrors,
    fields: rawData,
  };
};

export const collectAllErrorMessages = (
  errors: FieldErrors<unknown> | undefined
): string[] => {
  if (!errors) return [];

  let messages: string[] = [];

  if (Array.isArray(errors._errors)) {
    messages.push(...errors._errors);
  }

  Object.keys(errors).forEach((key) => {
    if (key === "_errors") {
      return;
    }

    const nested = (errors as Record<string, unknown>)[key];

    if (!isErrorNode(nested)) {
      return;
    }

    const hasNestedErrors =
      Array.isArray(nested._errors) ||
      Object.keys(nested).some((k) => k !== "_errors");

    if (hasNestedErrors) {
      messages = messages.concat(
        collectAllErrorMessages(nested as FieldErrors<unknown>)
      );
    }
  });

  return [...new Set(messages)];
};
