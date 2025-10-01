export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',

  auth: {
    domain: "dev-c8a5pw4mo1s1xgsm.jp.auth0.com",
    clientId: "NyaVxI1zH2q80m1dwsI4q27xGBW76Bsp",
    authorizationParams: {
      redirect_uri: "http://localhost:4200/login/callback",
      audience: "http://localhost:8080",
    },
  },

  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  }
};
