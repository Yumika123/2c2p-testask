import { atom } from 'recoil';
import { ICountry, ICountryList } from '../../types/countrylist';

export const currentCountryState = atom<ICountry>({
  key: '2c2p-current-country',
  default: undefined,
});

export const countryListState = atom<ICountryList>({
  key: '2c2p-countrylist',
  default: {
    countries: [],
  },
});
