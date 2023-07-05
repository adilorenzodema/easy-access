// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // beUrl: 'http://192.168.1.2:8080/',
  configFile: 'assets/config/config-test-app.json',
  header: {
    imgSidebar: 'assets/images/movyon.svg',
    title: 'Interporto'
  },
  footer: {
    year: '2022',
    title: '',
    link: '',
  },
  login: {
    image: 'assets/images/logo.png',
    title: "Login Interporto"
  },
  resetPassword: 'SHOW_RESET_PASSWORD'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
