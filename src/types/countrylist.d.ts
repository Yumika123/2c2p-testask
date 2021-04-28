interface ICountry {
  id: string;
  name: string;
  alpha2Code?: string;
}

export interface ICountryList {
  countries: ICountry[];
}
