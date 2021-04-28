export enum Status {
  CREATING = 'creating',
  ERROR = 'error',
  IDLE = 'idle',
  INITIAL = 'initial',
  LOADING = 'loading',
  SUCCESS = 'success',
  UPDATING = 'updating',
}

export interface StatusState<T = any> {
  status: Status;
  error?: T;
}

export const defaultStatus: StatusState = {
  status: Status.INITIAL,
  error: undefined,
};
