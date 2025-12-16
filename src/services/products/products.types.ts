export type StripeProductDto = {
  currency: string;
  id: string;
  lookupKey: string;
  productName: string;
  price: number;
  formattedPrice: string;
  recurring: string;
  metadata: { [key: string]: string };
};

export type CreditOptionsResponse = {
  quantity: string;
  price: string;
};
