import Joi from 'joi';
import { JOI_CONFIG } from '@src/config';
import { SchemaMap } from '@shared/types/validation.types';

export const authPostRegister = () =>
  Joi.object({
    username: Joi.string()
      .min(JOI_CONFIG.USER.MIN_USERNAME_LENGTH)
      .max(50)
      .required(),
    password: Joi.string()
      .min(JOI_CONFIG.USER.MIN_PASSWORD_LENGTH)
      .max(50)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    email: Joi.string().email().required(),
  }).options(JOI_CONFIG.DEFAULT_OPTIONS);

export const authPostLogin = () =>
  Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().max(50).required(),
  }).options(JOI_CONFIG.DEFAULT_OPTIONS);

export const authPostRefresh = () =>
  Joi.object({
    refreshToken: Joi.string().required(),
  }).options(JOI_CONFIG.DEFAULT_OPTIONS);

// VALIDATORS
const POST_AUTH_REGISTER: SchemaMap = {
  body: authPostRegister(),
};

const POST_AUTH_LOGIN: SchemaMap = {
  body: authPostLogin(),
};

const POST_AUTH_REFRESH: SchemaMap = {
  body: authPostRefresh(),
};

export default { POST_AUTH_LOGIN, POST_AUTH_REGISTER, POST_AUTH_REFRESH };
