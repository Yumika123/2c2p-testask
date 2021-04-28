import axios from 'axios';
import { ILocalBank } from '../types/localbank';
import { IBankList, IBank } from '../types/banklist';
import { IResponse } from '../types/response';

export interface BankListOptions {
  page?: number;
}

export default class BankListClient {
  private static endpoint = 'https://2c2p.mocklab.io/v1/banks';
  private static specific = 'https://2c2p.mocklab.io/v1/banks/{bankcode}';

  static loadBankList(
    options?: BankListOptions
  ): Promise<IResponse<IBankList>> {
    return axios.get(BankListClient.endpoint, { params: options });
  }

  static loadBank(bankCode: string): Promise<IResponse<IBank>> {
    return axios.get(BankListClient.specific.replace('{bankcode}', bankCode));
  }

  static createBank(bank: ILocalBank) {
    return axios.post(BankListClient.endpoint, {
      bankCode: bank.bankCode,
      bankName: bank.bankName,
      bankUrl: bank.bankUrl,
      country: bank.country,
      cardSchemes: bank.cardSchemes.map(scheme => ({ id: scheme })),
      contact: {
        name: bank.name,
        email: bank.email,
        mobile: bank.mobile,
        preferredMethod: bank.preferredMethod,
      },
      billing: {
        startDate: bank.startDate,
        period: bank.period,
        email: bank.billingEmail,
      },
    });
  }

  static updateBank(bankCode: string, bank: ILocalBank) {
    return axios.put(BankListClient.specific.replace('{bankcode}', bankCode), {
      bankName: bank.bankName,
      bankUrl: bank.bankUrl,
      country: bank.country,
      cardSchemes: bank.cardSchemes.map(scheme => ({ id: scheme })),
      contact: {
        name: bank.name,
        email: bank.email,
        mobile: bank.mobile,
        preferredMethod: bank.preferredMethod,
      },
      billing: {
        startDate: bank.startDate,
        period: bank.period,
        email: bank.billingEmail,
      },
    });
  }
}
