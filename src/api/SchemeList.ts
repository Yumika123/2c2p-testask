import axios from 'axios';
import { ISchemeList } from '../types/schemelist';
import { IResponse } from '../types/response';

export default class SchemeListClient {
  private static endpoint = 'https://2c2p.mocklab.io/v1/masterData/schemes';

  static loadSchemeList(): Promise<IResponse<ISchemeList>> {
    return axios.get(SchemeListClient.endpoint);
  }
}
