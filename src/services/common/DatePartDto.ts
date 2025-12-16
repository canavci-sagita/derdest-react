import z from "zod";

// export const datePartSchema = (
//   t: (key: string, params?: Record<string, any>) => string
// ) =>
//   z
//     .object({
//       day: z.number().nullable().optional(),
//       month: z.number().nullable().optional(),
//       year: z
//         .number()
//         .min(1900, { message: t("required.year") })
//         .nullable(),
//     })
//     .nullable()
//     .refine(
//       (data) => {
//         if (data?.day && !data.month) {
//           return false;
//         }
//         return true;
//       },
//       {
//         message: t("required.month.ifDayExists"),
//         path: ["month"],
//       }
//     );

//export type DatePartDto = z.infer<ReturnType<typeof datePartSchema>>;
export const datePartSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z
    .object({
      day: z.number().nullable().optional(),
      month: z.number().nullable().optional(),
      year: z.number().nullable(),
    })
    .refine((data) => !!data.year && data.year >= 1900, {
      message: t("required.year"),
      path: ["year"],
    })
    .refine(
      (data) => {
        if (data.day && !data.month) {
          return false;
        }
        return true;
      },
      {
        message: t("required.month.ifDayExists"),
        path: ["month"],
      }
    );

export type DatePartDto = z.infer<ReturnType<typeof datePartSchema>>;
