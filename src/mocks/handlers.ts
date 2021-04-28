import { rest } from 'msw';

import bankListMock from './bankListMock';
import countryListMock from './countryListMock';

const baseMockUrl = 'https://2c2p.mocklab.io';

export const handlers = [
  rest.get(baseMockUrl + '/v1/masterDate/countries', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(countryListMock));
  }),

  rest.get(baseMockUrl + '/v1/banks', (req, res, ctx) => {
    if (req.url.searchParams.get('page')) {
      return res(
        ctx.status(200),
        ctx.json({
          ...bankListMock,
          banks: bankListMock.banks.slice(
            (Number(req.url.searchParams.get('page')) - 1) * 5,
            Number(req.url.searchParams.get('page')) * 5
          ),
          pageIndex: Number(req.url.searchParams.get('page')),
          pageSize: 5,
          count: 8,
        })
      );
    }
    return res(ctx.status(200), ctx.json(bankListMock));
  }),
];
