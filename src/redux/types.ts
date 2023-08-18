import { FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';

export interface UserType {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  token: string | null;
}

export interface IGenericResponse {
  status: string;
  message: string;
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
}

export interface responseType {
  token(token: unknown): unknown;
  data: string;
  meta: FetchBaseQueryMeta | undefined;
}

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}
