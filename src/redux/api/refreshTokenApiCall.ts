// refreshTokenApiCall.ts
const refreshTokenApiCall = async (refreshToken: string): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default refreshTokenApiCall;
