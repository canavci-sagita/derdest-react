import z from "zod";

export const addEditAddressSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string,
  isOptional?: boolean
) =>
  z.object({
    addressLine1: isOptional
      ? z.string().optional()
      : z
          .string()
          .nonempty(t("required.addressLine1"))
          .max(100, t("maxLength.addressLine1", { maxLength: 100 })),
    addressLine2: z
      .string()
      .max(100, t("maxLength.addressLine2", { maxLength: 100 }))
      .nullable()
      .optional(),
    city: z.preprocess(
      (val) => val ?? "",
      isOptional
        ? z.string().nullable().optional()
        : z.string().min(1, t("required.city"))
    ),
    country: z.preprocess(
      (val) => val ?? "",
      isOptional
        ? z.string().nullable().optional()
        : z.string().min(1, t("required.country"))
    ),
    state: z
      .string()
      .max(20, t("maxLength.state", { maxLength: 20 }))
      .optional(),
    zipCode: z
      .string()
      .max(10, t("maxLength.zipCode", { maxLength: 10 }))
      .optional(),
  });

export type AddEditAddressDto = z.infer<
  ReturnType<typeof addEditAddressSchema>
>;
