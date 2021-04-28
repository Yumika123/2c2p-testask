import { useRecoilCallback } from 'recoil';
import SchemeListClient from '../../api/SchemeList';
import { ISchemeList } from '../../types/schemelist';
import { IResponse } from '../../types/response';
import { schemeListState } from './state';

export const useLoadSchemeList: () => () => void = () =>
  useRecoilCallback(({ set }) => async () => {
    try {
      const schemeList: IResponse<ISchemeList> = await SchemeListClient.loadSchemeList();
      set(schemeListState, schemeList.data);
    } catch (error) {
      console.error('useLoadCountryList: ' + error);
    }
  });
