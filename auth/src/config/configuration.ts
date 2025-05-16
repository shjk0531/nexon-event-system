export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.AUTH_PORT ?? '3001', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  mongo: {
    uri: process.env.MONGO_AUTH_URI,
  },
});
