import { useRecoilCallback } from 'recoil';
import BankListClient from '../../api/BankList';
import { ILocalBank } from '../../types/localbank';
import { IBankList, IBank } from '../../types/banklist';
import { IResponse } from '../../types/response';
import {
  bankListState,
  bankListFilters,
  bankEntityState,
  bankListStatus,
  bankEntityStatus,
} from './state';
import { Status, defaultStatus } from '../status';

export const useLoadBankList: () => (options?) => void = () =>
  useRecoilCallback(({ set, snapshot }) => async options => {
    const { status } = await snapshot.getPromise(bankListStatus);

    if (status === Status.LOADING) return;

    set(bankListStatus, { status: Status.LOADING });

    try {
      const bankList: IResponse<IBankList> = await BankListClient.loadBankList(
        options
      );
      set(bankListState, bankList.data);
      set(bankListStatus, { status: Status.IDLE });
    } catch (error) {
      set(bankListStatus, { status: Status.ERROR, error });
    }
  });

export const useLoadBank: () => (bankCode: string) => void = () =>
  useRecoilCallback(({ set, snapshot }) => async bankCode => {
    const { status } = await snapshot.getPromise(bankEntityStatus);

    if (status === Status.LOADING) return;

    set(bankEntityStatus, { status: Status.LOADING });

    try {
      const bank: IResponse<IBank> = await BankListClient.loadBank(bankCode);
      set(bankEntityState, {
        bankCode: bank.data.bankCode,
        bankName: bank.data.bankName,
        bankUrl: bank.data.bankUrl,
        billingEmail: bank.data.billing.email,
        period: bank.data.billing.period,
        startDate: bank.data.billing.startDate,
        cardSchemes: bank.data.cardSchemes.map(scheme => scheme.id),
        email: bank.data.contact.email,
        mobile: bank.data.contact.mobile,
        name: bank.data.contact.name,
        preferredMethod: bank.data.contact.preferredMethod.toString(),
        country: bank.data.country.toString(),
      } as ILocalBank);
      set(bankEntityStatus, { status: Status.IDLE });
    } catch (error) {
      set(bankListStatus, { status: Status.ERROR, error });
    }
  });

export const useClearBank: () => () => void = () =>
  useRecoilCallback(({ set }) => async () => {
    set(bankEntityState, undefined);
    set(bankEntityStatus, defaultStatus);
    set(bankListStatus, defaultStatus);
  });

export const useUpdateFilters: () => (filters) => void = () =>
  useRecoilCallback(({ set, snapshot }) => async filters => {
    try {
      const currentFilters = await snapshot.getPromise(bankListFilters);
      set(bankListFilters, { ...currentFilters, ...filters });
    } catch (error) {
      set(bankListStatus, { status: Status.ERROR });
    }
  });

export const useCreateBank: () => (bank: ILocalBank) => void = () =>
  useRecoilCallback(({ set, snapshot }) => async bank => {
    const { status } = await snapshot.getPromise(bankListStatus);

    if (status === Status.CREATING) return;

    set(bankListStatus, { status: Status.CREATING });
    await BankListClient.createBank(bank)
      .then(() => {
        set(bankListStatus, { status: Status.SUCCESS });
      })
      .catch(error => {
        set(bankListStatus, { status: Status.ERROR, error });
      });
  });

export const useUpdateBank: () => (
  bankCode: string,
  bank: ILocalBank
) => void = () =>
  useRecoilCallback(({ set, snapshot }) => async (bankCode, bank) => {
    const { status } = await snapshot.getPromise(bankListStatus);

    if (status === Status.UPDATING) return;

    set(bankListStatus, { status: Status.UPDATING });
    try {
      await BankListClient.updateBank(bankCode, bank);
      set(bankListStatus, { status: Status.SUCCESS });
    } catch (error) {
      set(bankListStatus, { status: Status.ERROR, error });
    }
  });
