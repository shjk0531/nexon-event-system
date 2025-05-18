import * as ms from 'ms';

export default () => ({
  port: parseInt(process.env.GATEWAY_PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: ms(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshExpiresIn: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  services: {
    auth: process.env.GATEWAY_AUTH_URL,
    event: process.env.GATEWAY_EVENT_URL,
  },
});
