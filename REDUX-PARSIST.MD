## USING REDUX PERSIST

Make sure you have the required dependencies installed. You've already installed @reduxjs/toolkit, @react-native-async-storage/async-storage, and redux-persist. Now, you need to install @reduxjs/toolkit/query:

```bash
yarn add @react-native-async-storage/async-storage redux react-redux @reduxjs/toolkit @reduxjs/toolkit/query redux-persist
```

```ts
// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = api;
```

Configure Store:
Add the API slice to your Redux store configuration.

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducer from './rootReducer';
import { api } from './apiSlice';

const store = configureStore({
  reducer: {
    ...rootReducer,
    [api.reducerPath]: api.reducer,
  },
});

export const persistor = persistStore(store);

export default store;
```

Using Redux Toolkit Query Hooks: Now, you can use the generated hooks from Redux Toolkit Query to interact with your API. For example, to handle the login action:

```ts
// LoginScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from './apiSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    const credentials = { username: 'yourUsername', password: 'yourPassword' };
    const result = await login(credentials).unwrapOrThrow();

    // Assuming the login endpoint returns a token
    dispatch(setToken(result.token));
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        Login
      </button>
    </div>
  );
};
export default LoginScreen;
```

Configure Redux Persist:
Set up Redux Persist to persist the authentication token using AsyncStorage.

```ts
// rootReducer.js
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './authSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // other reducers...
});

export default rootReducer;
```

Add Token to API Slice:
Extend your apiSlice.ts to include the token in the authorization header for authenticated requests.

```ts
// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the token from the Redux state
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    // Add other endpoints...
  }),
});

export const { useLoginMutation /* other generated hooks */ } = api;
```

Updating Component to Fetch Profile:
Update your component to use the token for authenticated API calls, such as fetching a user profile.

```ts
// ProfileScreen.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery } from './apiSlice';

const ProfileScreen = () => {
  const token = useSelector((state) => state.auth.token);
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useGetUserProfileQuery({}, { skip: !token });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading profile.</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {userProfile?.name}</p>
      <p>Email: {userProfile?.email}</p>
      {/* Render other profile information */}
    </div>
  );
};

export default ProfileScreen;
```
