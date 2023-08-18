import { setToken, setUser } from '../../features/authSlice';
import {
  Credentials,
  IGenericResponse,
  UserType,
  responseType,
} from '../../types';
import { Cookies } from 'react-cookie';
import { baseApi } from '../base';

const cookies = new Cookies();

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IGenericResponse, Credentials>({
      query(data) {
        return {
          url: 'register',
          method: 'POST',
          body: data,
        };
      },
    }),
    login: builder.mutation<responseType, Credentials>({
      query: (data) => {
        return {
          url: '/login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if (response.data.token) {
            cookies.set('access_token', response.data.token, { path: '/' });
            dispatch(setToken(response.data.token.toString()));
          }
          await dispatch(userApi.endpoints.me.initiate());
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    me: builder.query<UserType, void>({
      query: () => 'profile',
    }),
    getMe: builder.query<UserType, null>({
      query() {
        return {
          url: 'profile',
        };
      },
      transformResponse: (data: { user: UserType }) => {
        return data.user;
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useGetMeQuery,
} = userApi;
