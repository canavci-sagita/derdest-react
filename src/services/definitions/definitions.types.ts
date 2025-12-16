import z from "zod";

export interface CaseTypeGridDto {
  id: number;
  title: string;
  createdOn: Date;
  isDeleted: boolean;
}

export const addEditCaseTypeSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    title: z
      .string()
      .nonempty(t("required.title"))
      .max(40, t("maxLength.title", { maxLength: 40 })),
  });

export type AddEditCaseTypeDto = z.infer<
  ReturnType<typeof addEditCaseTypeSchema>
>;

export interface ContractTypeGridDto {
  id: number;
  title: string;
  description: string;
  createdOn: Date;
  isDeleted: boolean;
}

export const addEditContractTypeSchema = (
  t: (key: string, params?: Record<string, string | number | null>) => string
) =>
  z.object({
    id: z.coerce.number().optional(),
    title: z
      .string()
      .nonempty(t("required.title"))
      .max(10, t("maxLength.title", { maxLength: 10 })),
    description: z
      .string()
      .max(40, t("maxLength.description", { maxLength: 40 }))
      .optional(),
  });

export type AddEditContractTypeDto = z.infer<
  ReturnType<typeof addEditContractTypeSchema>
>;
