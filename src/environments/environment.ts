// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // host:'https://admin.housingstreet.com',
  // apiUrl: 'https://admin.housingstreet.com'
  
  apiUrl:  'http://127.0.0.1:8000',
  ftpURL:  'http://127.0.0.1:8000/storage/',
  siteURL: 'http://localhost:4200/',
  googleURL: 'http://localhost:8000/api/auth/redirect/',
  Paytm_formURL: 'https://securegw-stage.paytm.in/order/process',
  you_tube_url:'https://www.youtube-nocookie.com/embed/',
  google_map_url:'https://maps.google.co.in/maps?q=',
  toll_free: '18005475450',
  App_version:'v2.0.8'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
