const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_APP_URL_CALLBACK_URL: process.env.CLIENT_APP_URL_CALLBACK_URL,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
};
