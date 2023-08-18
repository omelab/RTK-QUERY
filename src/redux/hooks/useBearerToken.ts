import { useCookies } from 'react-cookie';

export function useBearerToken() {
  const [cookies] = useCookies(['bearerToken']);
  return cookies.bearerToken || ''; // Return the bearer token or an empty string if not found
}
