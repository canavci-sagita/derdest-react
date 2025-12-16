import { StripeProductDto } from "../products/products.types";

export type VerifyPaymentRequest = {
  sessionId: string;
};

export type BuyCreditsRequest = {
  quantity: number;
  redirectUrl: string;
};

export interface InvoiceDto {
  id: string;
  createdDate: string;
  amountPaid: string;
  currency: string;
  status: string;
  invoiceUrl: string;
  description: string;
}

export interface SubscriptionDto {
  status: string;
  daysUntilDue: number;
  product: StripeProductDto;
}
