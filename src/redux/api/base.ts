import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchBaseQueryError,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
import { SerializedError } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const cookies = new Cookies();

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers) => {
    //get header form cookies
    const token = cookies.get('access_token');

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const simpleBaseQuery: BaseQueryFn<
  string | FetchArgs, // Args
  unknown, // Result
  FetchBaseQueryError | SerializedError
> = async (args, api, extraOptions) => {
  const response = await baseQuery(args, api, extraOptions);

  if (response.error && response.error.status === 'PARSING_ERROR') {
    window.location.href = `/404`;
  }

  if (response.error && response.error.status === 401) {
    localStorage.removeItem('auth');
    window.location.href = `/login`;
  }

  return response;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: simpleBaseQuery,
  keepUnusedDataFor: 0,
  tagTypes: [],
  endpoints: () => ({}),
});

export default baseApi;
