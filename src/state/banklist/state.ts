import { atom } from 'recoil';
import { ILocalBank } from '../../types/localbank';
import { IBankList } from '../../types/banklist';
import { StatusState, defaultStatus } from '../status';

export const bankListFilters = atom({
  key: '2c2p-banklist-filters',
  default: undefined,
});

export const bankEntityState = atom<ILocalBank>({
  key: '2c2p-bank-entity',
  default: undefined,
});

export const bankListState = atom<IBankList>({
  key: '2c2p-banklist',
  default: {
    banks: [],
  },
});

export const bankListStatus = atom<StatusState>({
  key: 'transform-available-years-status',
  default: defaultStatus,
});

export const bankEntityStatus = atom<StatusState>({
  key: 'transform-available-years-status',
  default: defaultStatus,
});
