const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  serviceName: process.env.SERVICE_NAME,
  mongoURL: process.env.MONGO_URL,
};
