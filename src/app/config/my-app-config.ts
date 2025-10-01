// export default {
//   auth: {
//     domain: "dev-c8a5pw4mo1s1xgsm.jp.auth0.com",
//     clientId: "NyaVxI1zH2q80m1dwsI4q27xGBW76Bsp",
//     authorizationParams: {
//       redirect_uri: "http://localhost:4200/login/callback",
//       audience: "http://localhost:8080",
//     },
//   },
//   httpInterceptor: {
//     allowedList: [
//       'http://localhost:8080/api/orders/**',
//       'http://localhost:8080/api/checkout/purchase'
//     ],
//   },
// }
export default {
  auth: {
    domain: "dev-c8a5pw4mo1s1xgsm.jp.auth0.com",
    clientId: "NyaVxI1zH2q80m1dwsI4q27xGBW76Bsp",
    authorizationParams: {
      redirect_uri: "https://aibazzar.netlify.app/login/callback",
      audience: "https://aibazar-backend-production.up.railway.app",
    },
  },
  httpInterceptor: {
    allowedList: [
      'https://aibazar-backend-production.up.railway.app/api/orders/**',
      'https://aibazar-backend-production.up.railway.app/api/checkout/purchase'
    ],
  },
}
