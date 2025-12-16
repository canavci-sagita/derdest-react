import z from "zod";

export const addEditPhoneNoSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    countryCode: z
      .string()
      .max(5, t("maxLength.phoneNo.countryCode", { maxLength: 5 }))
      .nullable()
      .optional(),
    value: z
      .string()
      .max(20, t("maxLength.phoneNo.value", { maxLength: 20 }))
      .nullable()
      .optional(),
  });

export type AddEditPhoneNoDto = z.infer<
  ReturnType<typeof addEditPhoneNoSchema>
>;
