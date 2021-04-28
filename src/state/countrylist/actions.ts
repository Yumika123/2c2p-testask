import { useRecoilCallback } from 'recoil';
import CountryListClient from '../../api/CountryList';
import { ICountry, ICountryList } from '../../types/countrylist';
import { IResponse } from '../../types/response';
import { countryListState, currentCountryState } from './state';

export const useLoadCountryList: () => () => void = () =>
  useRecoilCallback(({ set }) => async () => {
    try {
      const countryList: IResponse<ICountryList> = await CountryListClient.loadCountryList();
      set(countryListState, countryList.data);
    } catch (error) {
      console.error('useLoadCountryList: ' + error);
    }
  });

export const useSetCurrentCountry: () => (
  currentCountry: ICountry
) => void = () =>
  useRecoilCallback(({ set }) => async currentCountry => {
    try {
      const currentCountryAlpha2Code: any = await CountryListClient.getAlpha2Code(
        currentCountry.name
      );

      const code = currentCountryAlpha2Code?.data[0]?.alpha2Code || 'TH';
      set(currentCountryState, {
        ...currentCountry,
        alpha2Code: code?.toLowerCase(),
      });
    } catch (error) {
      console.error('useSetCurrentCountry: ' + error);
    }
  });
