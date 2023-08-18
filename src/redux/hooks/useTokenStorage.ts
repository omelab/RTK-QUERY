import { useCookies } from 'react-cookie';

export function setBearerTokenInCookie(token: string) {
  const [cookies, setCookie] = useCookies(['bearerToken']);
  setCookie('bearerToken', token, { path: '/' });
}
