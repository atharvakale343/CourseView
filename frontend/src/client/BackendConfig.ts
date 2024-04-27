const DEV_BACKEND_CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

const PROD_BACKEND_CONFIG = {
  SERVER_URL: 'https://www.courseview.us',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

export const BACKEND_CONFIG = import.meta.env.DEV
  ? DEV_BACKEND_CONFIG
  : PROD_BACKEND_CONFIG;

console.log(BACKEND_CONFIG);

const backendRoute = (route: string) => `${BACKEND_CONFIG.SERVER_URL}${route}`;

export const fetchBackendRoute = async (
  route: string,
  options: RequestInit = {}
): Promise<Response> => {
  return fetch(backendRoute(route), { ...options, credentials: 'include' });
};
