import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  EVENT_PORT: Joi.number().required(),
  MONGO_EVENT_URI: Joi.string().required(),
  REFERRAL_JWT_SECRET: Joi.string().required(),
  REFERRAL_JWT_EXPIRES_IN: Joi.string().required(),
});
