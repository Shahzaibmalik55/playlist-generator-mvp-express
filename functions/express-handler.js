const serverless = require("serverless-http");
const app = require("../src/index"); // Adjust the path to your `index.js` file

module.exports.handler = serverless(app);
