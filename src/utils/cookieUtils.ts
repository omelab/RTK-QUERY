import { Cookies } from 'react-cookie';
const cookies = new Cookies();

export const setCookie = (newAccessToken: string) => {
  cookies.set('access_token', newAccessToken, { path: '/' });
};

export const getCookie = (cookieName: string) => {
  const cookieData = cookies.get(cookieName);
  if (cookieData) return cookieData;
  return false;
};
