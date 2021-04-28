interface ICardScheme {
  id: number;
}

interface IContact {
  name: string;
  email: string;
  mobile: string;
  preferredMethod: number;
}

interface IBilling {
  startDate: string;
  period: number;
  email: string;
}

export interface ILocalBank {
  bankCode?: string;
  bankName?: string;
  bankUrl?: string;
  country?: string;
  cardSchemes?: number[];
  name?: string;
  email?: string;
  mobile?: string;
  preferredMethod?: string;
  startDate?: string;
  period?: number;
  billingEmail?: string;
}
