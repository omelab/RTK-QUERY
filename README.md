# React + TypeScript + Vite




## Form Data Handling

Assuming you have an endpoint called uploadFile that requires a multipart/form-data header:

```ts
export const baseApi = createApi({
  // ... other configuration options
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
        headers: {
          // No initial authorization header here, you can customize this per your needs
        },
      }),
    }),
    // ... other endpoints
  }),
});
```

Now, when you're making a request to the uploadFile endpoint and you want to set the multipart/form-data header, you can do the following:

```ts
// Assuming you have the baseApi available
const formData = new FormData();
formData.append('file', file); // 'file' is the key associated with the file data

const response = await baseApi.endpoints.uploadFile(formData, {
  headers: {
    // Set the specific header for this request
    'Content-Type': 'multipart/form-data',
    // Add any other headers if needed
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## Secure Token Storage
Install the necessary packages:
```bash 
npm install @reduxjs/toolkit react-redux react @reduxjs/toolkit/query react-query devtools secure-ls
```

#### Create Secure Token Storage:

Create a file named src/secureTokenStorage.ts to encapsulate the logic for securely storing and retrieving tokens:

```typescript
import SecureLS from 'secure-ls';

const secureLS = new SecureLS();

const TOKEN_KEY = 'my_crm_access_token';

export function saveAccessToken(token: string) {
  secureLS.set(TOKEN_KEY, token);
}

export function loadAccessToken(): string | null {
  return secureLS.get(TOKEN_KEY) || null;
}

export function removeAccessToken() {
  secureLS.remove(TOKEN_KEY);
}
```

#### Update authSlice.ts:
```typescript
// src/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from './api';
import { saveAccessToken, loadAccessToken } from './secureTokenStorage';

interface AuthState {
  tokens: {
    access_token: string | null;
    refresh_token: string | null;
  };
}

const initialState: AuthState = {
  tokens: {
    access_token: loadAccessToken(),
    refresh_token: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthResponse>) => {
      const { access_token, refresh_token } = action.payload;
      saveAccessToken(access_token);
      state.tokens.access_token = access_token;
      state.tokens.refresh_token = refresh_token;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      const access_token = action.payload;
      saveAccessToken(access_token);
      state.tokens.access_token = access_token;
    },
    // ... other reducers
  },
});

export const { setTokens, updateAccessToken } = authSlice.actions;

export default authSlice.reducer;
```

##### Integrate Secure Token Storage with API Calls:
Update the API requests to use the stored access token:
```typescript
// src/api.ts

// ... import statements ...

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.example.com',
    prepareHeaders: (headers, { getState }) => {
      const access_token = selectAccessToken(getState());
      if (access_token) {
        headers.set('Authorization', `Bearer ${access_token}`);
      }
      return headers;
    },
  }),
  // ... endpoint configurations ...
});

// ... other code ...
```


## parsing csv to string


[help](https://contactmentor.com/react-js-convert-csv-to-json/?expand_article=1)

### help
- [Redux-toolkit-query](https://blog.bitsrc.io/frontend-caching-with-redux-toolkit-query-14e008a632b1)
- [RTK Query](https://codevoweb.com/setup-redux-toolkit-and-rtk-query/)
- [State Manage](https://www.freecodecamp.org/news/use-redux-toolkit-to-manage-state-in-react-apps/)
- [@tailwindcs](https://tailwindcss.com/docs/guides/vite)
- [JWT Authentication](https://github.com/wpcodevo/JWT_Authentication_React/tree/react_node_jwt_login)
- [Refresh Token](https://github.com/wpcodevo/JWT_Authentication_React/tree/react_node_jwt_refresh_token)
- [redux-persist](https://stackoverflow.com/questions/67943867/what-happens-when-i-use-rtk-query-with-redux-persist)


## formater
- [lint format](https://stackoverflow.com/questions/61731587/vscode-prettier-doesnt-format-tsx-file)
- [lint prettier](https://dev.to/knowankit/setup-eslint-and-prettier-in-react-app-357b)
- [ESLint + Prettier + Typescript](https://blog.devgenius.io/eslint-prettier-typescript-and-react-in-2022-e5021ebca2b1)
- [expert-backend]https://blog.devgenius.io/become-an-expert-backend-projects-that-define-senior-developers-61ac76e17d98