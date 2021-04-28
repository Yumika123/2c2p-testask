import { atom } from 'recoil';
import { ISchemeList } from '../../types/schemelist';

export const schemeListState = atom<ISchemeList>({
  key: '2c2p-schemelist',
  default: {
    cardSchemes: [],
  },
});
