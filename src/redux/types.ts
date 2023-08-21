import { FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';

export interface UserType {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  tokens: {
    access_token: string | null;
    refresh_token: string | null;
  };
}

export interface IGenericResponse {
  status: string;
  message: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface responseType {
  accessToken(accessToken: unknown): unknown;
  refreshToken(refreshToken: unknown): unknown;
  data: string;
  meta: FetchBaseQueryMeta | undefined;
}

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}
