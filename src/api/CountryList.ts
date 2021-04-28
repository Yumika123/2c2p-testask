import axios from 'axios';
import { ICountryList } from '../types/countrylist';
import { IResponse } from '../types/response';

export default class CountryListClient {
  private static endpoint = 'https://2c2p.mocklab.io/v1/masterData/countries';
  private static countriesAPI =
    'https://restcountries.eu/rest/v2/name/{name}?fullText=true';

  static loadCountryList(): Promise<IResponse<ICountryList>> {
    return axios.get(CountryListClient.endpoint);
  }

  static getAlpha2Code(countryName: string): Promise<any> {
    return axios.get(
      CountryListClient.countriesAPI.replace('{name}', countryName)
    );
  }
}
