export interface IErrorResponse {
  errorCode: string;
  errorDescription: string;
}

export interface IResponse<T> {
  data: T;
}
