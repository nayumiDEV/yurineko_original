require("dotenv").config();
const { resolve } = require('path');

module.exports = {
  R18: parseInt(process.env.R18),
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: parseInt(process.env.DB_PORT),
  JWT_TIMEOUT_DURATION: process.env.JWT_TIMEOUT_DURATION,
  JWT_SECRET: process.env.JWT_SECRET,
  PAGE_SIZE: parseInt(process.env.PAGE_SIZE),
  AWS_S3_HOST_NAME: 'https://storage.yurineko.moe',
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  STORAGE_DIR: resolve(`${__dirname}/../../yuri-storage/public`),
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_SERVICE_PASSWORD: process.env.EMAIL_SERVICE_PASSWORD,
  EMAIL_SERVICE_CLIENT_ID: process.env.EMAIL_SERVICE_CLIENT_ID,
  EMAIL_SERVICE_CLIENT_SECRET: process.env.EMAIL_SERVICE_CLIENT_SECRET,
  EMAIL_SERVICE_REFRESH_TOKEN: process.env.EMAIL_SERVICE_REFRESH_TOKEN,
  API_HOST: process.env.API_HOST,
  HOST: process.env.HOST,
  GCM_KEY: "AIzaSyBr5SZLoEKd15dSPdPI-Jxw7xh1oL2Fi3M",
  PUBLIC_PUSH_KEY:
    "BPug0MTxmex8geQCVJjdwriJK3XEzTw2DH4ybqk_zmX1g7lCHEVRH0RKWVzkGQnP0_QBmKRBFd313275Lv0IKBM",
  PRIVATE_PUSH_KEY: "lC5-Y33KnK2FU6km85nYMAxod6qBH2VwRKcYpIAEEeI",
  BAOKIM_API_ENDPOINT: process.env.BAOKIM_API_ENDPOINT,
  BAOKIM_API_KEY: process.env.BAOKIM_API_KEY,
  BAOKIM_API_SECRET: process.env.BAOKIM_API_SECRET,
  BAOKIM_TOKEN_EXPIRE: parseInt(process.env.BAOKIM_TOKEN_EXPIRE),
  BAOKIM_MERCHANT_ID: parseInt(process.env.BAOKIM_MERCHANT_ID),
  CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
  CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL
};
