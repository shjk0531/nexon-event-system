export default () => ({
  port: parseInt(process.env.GATEWAY_PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  serviceUrl: {
    auth: process.env.AUTH_SERVICE_URL,
    event: process.env.EVENT_SERVICE_URL,
  },
});
