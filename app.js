// app.js (or i18n-config.js)
const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es', 'fr', 'de'], // supported locales
  directory: __dirname + '/locales', // path to locale files
  defaultLocale: 'en', // default locale
  cookie: 'lang', // cookie name to store locale
  autoReload: true, // reload translations when files change
  updateFiles: false, // don't create missing locale files automatically
});

// Make i18n available globally (optional but convenient)
global.__ = i18n.__;

module.exports = i18n; // Export for explicit imports