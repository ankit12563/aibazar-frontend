
export const environment = {
  production: true,
  apiUrl: 'https://aibazar-backend-production.up.railway.app/api',

  auth: {
    domain: 'dev-c8a5pw4mo1s1xgsm.jp.auth0.com',
    clientId: 'NyaVxI1zH2q80m1dwsI4q27xGBW76Bsp',
    authorizationParams: {
      redirect_uri: 'https://aibazzar.netlify.app/login/callback',
      audience: 'https://aibazar-backend-production.up.railway.app',
    },
  },

  // ✅ FIXED VERSION — compatible with latest @auth0/auth0-angular
  httpInterceptor: {
    allowedList: [
      'https://aibazar-backend-production.up.railway.app/api/orders/*',
      'https://aibazar-backend-production.up.railway.app/api/checkout/purchase'
    ],
  },
};
