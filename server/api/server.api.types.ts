import type { HTTPStatusCode } from 'nitropack/types';

export interface IApiValidationSimpleErrorResponse {
  statusMessage: string;
  statusCode: HTTPStatusCode;
}

export interface IApiValidationFieldErrorResponse<TField extends string> {
  field: TField;
  message: string;
}

export interface IApiValidationDetailedResponse<TField extends string> {
  validationErrors: Array<IApiValidationFieldErrorResponse<TField>>;
  statusCode: 422;
}

export interface IApiValidationSimpleSuccessResponse {
  statusMessage: 'Ok';
}
