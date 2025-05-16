import * as Joi from 'joi';

export default Joi.object({
  GATEWAY_PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  GATEWAY_AUTH_URL: Joi.string().required(),
  GATEWAY_EVENT_URL: Joi.string().required(),
});
