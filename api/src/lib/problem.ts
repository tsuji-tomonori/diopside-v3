export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
  retryable?: boolean;
  trace_id: string;
  errors?: Array<{ field?: string; message: string; code?: string }>;
};

export class ProblemError extends Error {
  status: number;
  code: string;
  retryable: boolean;
  errors?: Array<{ field?: string; message: string; code?: string }>;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    retryable?: boolean;
    errors?: Array<{ field?: string; message: string; code?: string }>;
  }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.retryable = params.retryable ?? false;
    if (params.errors !== undefined) {
      this.errors = params.errors;
    }
  }
}
