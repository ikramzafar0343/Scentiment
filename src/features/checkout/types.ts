export type CheckoutFieldName =
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'address1'
  | 'address2'
  | 'city'
  | 'postalCode'
  | 'country';

export type CheckoutValues = Record<CheckoutFieldName, string>;
export type CheckoutErrors = Partial<Record<CheckoutFieldName, string>>;

export type CheckoutErrorItem = {
  field: CheckoutFieldName;
  message: string;
};

