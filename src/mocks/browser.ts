import { setupWorker } from 'msw';
// import { handlers } from './handlers';

export const worker = setupWorker(
  // Uncomment, if API doesn't work
  // ...handlers
);
