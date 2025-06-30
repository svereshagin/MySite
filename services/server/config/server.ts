const fs = require('fs');

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'https://strapi.proggyit.ru',
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: 'https://strapi.proggyit.ru/admin',
  },
  // ssl: {
  //   key: fs.readFileSync('/etc/letsencrypt/live/strapi.proggyit.ru/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/strapi.proggyit.ru/fullchain.pem'),
  // }

});