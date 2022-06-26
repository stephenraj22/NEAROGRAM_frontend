// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setUpRefreshToken = (res: any) => {
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthResponse = await res.reloadAuthResponse();
    refreshTiming = (newAuthResponse.expires_in || 3600 - 5 * 60) * 1000;

    setTimeout(refreshToken, refreshTiming);
  };

  //Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};
