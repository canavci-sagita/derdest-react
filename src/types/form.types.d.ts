/**
 * The shape of Zod's flattened field errors.
 * It's an object where each key (matching the form values) can have an array of error strings.
 */
export type FieldErrors<T> = {
  [K in keyof T]?: FieldErrors<T[K]>;
} & { _errors?: string[] };

/**
 * A generic type for the state of a form that uses a Server Action.
 * @template TFormValues The shape of the form's data/values.
 */
export type ActionFormState<TFormValues> = {
  /** The current status of the form action. */
  status: "idle" | "success" | "error";

  /** A general message for the form, typically for success or top-level errors. */
  message?: string | string[] | null;

  /** An object containing validation errors for specific fields. */
  errors?: z.ZodFormattedError<TFormValues> & { _errors?: string[] };

  /** The data the user submitted, to re-populate the form on error. */
  fields?: Partial<TFormValues>;

  /** The response object from the api. */
  result?: unknown;
};
