export interface AmberResponse<T> {
  data: T;
  flags: Flags;
  error: AmberError;
}

export interface Flags {
  list: boolean;
  size: number;
}

export interface AmberError {
  message: string;
  errorKey: string;
}
