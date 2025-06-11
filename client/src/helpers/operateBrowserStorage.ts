const getTokenFromLocalStorage = () => localStorage.getItem("token");
const getRefreshTokenFromLocalStorage = () => localStorage.getItem("refresh");

const getKeepMeLoggedInFromLocalStorage = (): boolean | null => {
  const value = localStorage.getItem("logged");
  return value !== null ? (JSON.parse(value) as boolean) : null;
};

const setTokenToLocalStorage = (token: string) =>
  localStorage.setItem("token", token);
const setRefreshTokenToLocalStorage = (refresh: string) =>
  localStorage.setItem("refresh", refresh);
const setKeepMeLoggedInToLocalStorage = (value: string) =>
  localStorage.setItem("logged", value);


const removeTokensFromLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};

const getTokenFromSessionStorage = () => sessionStorage.getItem("token");


const setTokenToSessionStorage = (token: string) =>
  sessionStorage.setItem("token", token);

const removeTokenFromSessionStorage = () => sessionStorage.removeItem("token");

export {
  getTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  getKeepMeLoggedInFromLocalStorage,
  setTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setKeepMeLoggedInToLocalStorage,
  removeTokensFromLocalStorage,
  getTokenFromSessionStorage,
  setTokenToSessionStorage,
  removeTokenFromSessionStorage,
};
