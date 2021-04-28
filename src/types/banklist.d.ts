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

interface IBank {
  bankCode: string;
  bankName: string;
  bankUrl?: string;
  billing?: IBilling;
  cardSchemes?: ICardScheme[];
  contact?: IContact;
  country?: number;
  createdDate: string;
  modifiedDate: string;
}

export interface IBankList {
  banks: IBank[];
}
