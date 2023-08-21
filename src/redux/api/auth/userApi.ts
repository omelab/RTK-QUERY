import { setToken, setUser } from '../../features/authSlice';
import { Credentials, IGenericResponse, responseType } from '../../types';
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
          url: '/auth/signin',
          method: 'POST',
          body: data,
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { accessToken, refreshToken },
          } = await queryFulfilled;

          if (accessToken) {
            cookies.set('access_token', accessToken, { path: '/' });
            cookies.set('refresh_token', refreshToken, { path: '/' });

            const token = {
              access_token: accessToken.toString(),
              refresh_token: refreshToken.toString(),
            };

            dispatch(setToken(token));
          }

          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
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
    getMe: builder.query<any, null>({
      query() {
        return {
          url: '/auth/profile',
        };
      },
      transformResponse: (data: any) => {
        const user = data;
        user.role = 'admin';
        return user;
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.log('error');
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
  useGetMeQuery,
} = userApi;
