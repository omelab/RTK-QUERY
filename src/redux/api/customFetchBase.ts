/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const tokenData =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmYzNjkwZjMzNTE1OTg2YzJmM2UzN2NlNjRmMDQ0OGIyN2EyYzk4YTlhNzkwYTIxYTY2NDg2ODNmMjZkYzBiNTM5MTAwNmNlODI4MjUwMjUiLCJpYXQiOjE2OTIzMzk0NjEuNzM1NTcsIm5iZiI6MTY5MjMzOTQ2MS43MzU1NzEsImV4cCI6MTcyMzk2MTg2MS43MzMzNTIsInN1YiI6IjIiLCJzY29wZXMiOlsidXNlciJdfQ.PCqCsXu5ONP2kpG1NQcrM0ElcoZcDkaZsKZY9-EWQQKRs6vWOQwJAVb6s6Nz0nKDBZrTqZ1-hk4Ata8oy0Qhn9ESWT63NwRUK9yJLND2rrdG9f1yEgx3lE8eK0r22FqPK7174D-u6YdkwFHSdhtW-AWw1h9dBKDl1RpQH93DWLtNubfONNFq3YxSQgO932jyGtzryKiaRq8cCPAatNRLxpHOYBoL3sNY9UgyMxBpKKLzcehytC_WZdujtLU_yfgORxnntfPpTaWRt_6kgFCySdZzSRVKrxTqiRKVKZBQBz9hNsOl5a6TZAunWFiNSZ1mhwMpTMXiwR2SDaAoXSXXhnaruCZP9QrTqvkoYedNLZJBGMr7DedAMYSzkS8L15A0qpXMIFbjEliHa7Hlhe0Bz3v3alT1XJ6gEG4PHsv-eCtbDe-QxN3V92xOl8Vm4GqGRufAuPRDyER3ONu0hN3S-wIs9WtlZ9vZNUz7WDf1Qo7HiUKWhwfiRTO262ZnRJkBuELbsmuSOk6lzz7DUCIwyaU7-AI_IiIr0XE9RecxZPvRKib-P4fQ67-rgbbweTHCTQZ8VMLvVjRexDuzfA6anCQS9d7HiSwDWHjHZXgObPVgn2_AKCBcTMPKi3TtK3W9RUTPjqamNe1ZLteFYJNkyinSsIp4waAjh-RKVxPPEag';

export const customFetchBase = async (
  url: string,
  options: CustomFetchOptions = {}
) => {
  try {
    // const token = cookies.get('access_token'); // Get token from cookie
    const headers = {
      Authorization: `Bearer ${tokenData}`,
      'Custom-Header': 'Custom-Value',
      ...options.customHeaders,
    };

    const config: AxiosRequestConfig = {
      url,
      method: options.method || 'get',
      headers,
      ...options,
    };

    const response = await axios.request(config);

    if (response.status === 401) {
      // Handle token expiration and refresh as before
      //   const refreshToken = 'your-token';

      // Update the access token in the cookie after refresh
      const newAccessToken = await refreshAccessToken(tokenData);
      cookies.set('access_token', newAccessToken, { path: '/' });

      // Retry the request with the new access token
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      const retryResponse = await axios.request(config);

      if (retryResponse.status !== 200) {
        throw new Error(`HTTP error on retry! Status: ${retryResponse.status}`);
      }

      return retryResponse.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(`Fetch error: ${error}`);
  }
};

// Function to refresh access token using refresh token
const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/refresh-token`,
      { refreshToken }, // Provide the refresh token data in the request body
      {
        headers: {
          'Content-Type': 'application/json', // Set the appropriate content type
        },
      }
    );

    if (!response.data || !response.data.newAccessToken) {
      throw new Error('Invalid response from token refresh request');
    }

    const { newAccessToken } = response.data;
    return newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

export interface CustomFetchOptions extends AxiosRequestConfig {
  customHeaders?: Record<string, string>;
}

export const createApiRequest = (
  url: string,
  method: string,
  body?: any
): Request => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const requestInit: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  return new Request(url, requestInit);
};

export const createFormDataRequest = (
  url: string,
  method: string,
  formData: FormData
): Request => {
  const headers = new Headers();
  const requestInit: RequestInit = {
    method,
    headers,
    body: formData,
  };
  return new Request(url, requestInit);
};
