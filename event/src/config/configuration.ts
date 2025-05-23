export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.EVENT_PORT ?? '3002', 10),
  mongo: {
    uri: process.env.MONGO_EVENT_URI,
  },
  jwt: {
    secret: process.env.REFERRAL_JWT_SECRET,
    expiresIn: process.env.REFERRAL_JWT_EXPIRES_IN,
  },
});
