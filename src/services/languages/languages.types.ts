import z from "zod";
import { LanguageDirection } from "../common/enums";

export const addEditLanguageSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    name: z
      .string()
      .nonempty("required.languageName")
      .max(20, t("maxLength.languageName", { maxLength: 50 })),
    languageCode: z
      .string()
      .nonempty(t("required.languageCode"))
      .max(3, t("maxLength.languageCode", { maxLength: 3 })),
    cultureCode: z
      .string()
      .nonempty(t("required.cultureCode"))
      .max(5, t("maxLength.cultureCode", { maxLength: 5 })),
    icon: z
      .string()
      .nonempty(t("required.languageIcon"))
      .max(10, t("maxLength.languageIcon", { maxLength: 10 })),
    direction: z.coerce.number().pipe(
      z.nativeEnum(LanguageDirection, {
        message: t("required.languageDirection"),
      })
    ),
    dateFormat: z
      .string()
      .nonempty(t("required.dateFormat"))
      .max(14, t("maxLength.dateFormat", { maxLength: 14 })),
    timeFormat: z
      .string()
      .nonempty(t("required.timeFormat"))
      .max(11, t("maxLength.timeFormat", { maxLength: 11 })),
  });

export type AddEditLanguageDto = z.infer<
  ReturnType<typeof addEditLanguageSchema>
>;
