import joi from 'joi';
import { ALL } from '../types/models/api-token.js';
import { ApiTokenType } from '../types/model.js';
import { DEFAULT_ENV } from '../util/constants.js';

export const createApiToken = joi
    .object()
    .keys({
        username: joi.string().optional(),
        tokenName: joi.string().optional(),
        type: joi
            .string()
            .lowercase()
            .required()
            .valid(
                ApiTokenType.ADMIN,
                ApiTokenType.CLIENT,
                ApiTokenType.FRONTEND,
            ),
        expiresAt: joi.date().optional(),
        project: joi.when('projects', {
            not: joi.required(),
            then: joi.string().optional().default(ALL),
        }),
        projects: joi.array().min(0).optional(),
        environment: joi.when('type', {
            is: joi.string().valid(ApiTokenType.CLIENT, ApiTokenType.FRONTEND),
            then: joi.string().optional().default(DEFAULT_ENV),
            otherwise: joi.string().optional().default(ALL),
        }),
    })
    .nand('username', 'tokenName')
    .nand('project', 'projects')
    .options({ stripUnknown: true, allowUnknown: false, abortEarly: false });
