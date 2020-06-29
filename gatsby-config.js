/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyBmsSk36V95f5klHDcaUG23wEMQdH523Bo",
          authDomain: "matcha-a0168.firebaseapp.com",
          databaseURL: "https://matcha-a0168.firebaseio.com",
          projectId: "matcha-a0168",
          storageBucket: "matcha-a0168.appspot.com",
          messagingSenderId: "832340212007",
          appId: "1:832340212007:web:0944f0f55e104cccb05102",
        },
      },
    },
  ],
}
