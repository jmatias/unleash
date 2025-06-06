import type { FromSchema } from 'json-schema-to-ts';
import { parametersSchema } from './parameters-schema.js';
import { variantSchema } from './variant-schema.js';
import { overrideSchema } from './override-schema.js';
import {
    playgroundStrategyEvaluation,
    playgroundStrategySchema,
} from './playground-strategy-schema.js';
import { playgroundConstraintSchema } from './playground-constraint-schema.js';
import { playgroundSegmentSchema } from './playground-segment-schema.js';

export const unknownFeatureEvaluationResult = 'unevaluated' as const;

export const playgroundFeatureSchema = {
    $id: '#/components/schemas/playgroundFeatureSchema',
    description:
        'A simplified feature flag model intended for the Unleash playground.',
    type: 'object',
    additionalProperties: false,
    required: [
        'name',
        'projectId',
        'isEnabled',
        'isEnabledInCurrentEnvironment',
        'variant',
        'variants',
        'strategies',
    ],
    properties: {
        name: {
            type: 'string',
            example: 'my-feature',
            description: "The feature's name.",
        },
        projectId: {
            type: 'string',
            example: 'my-project',
            description: 'The ID of the project that contains this feature.',
        },
        strategies: {
            type: 'object',
            additionalProperties: false,
            required: ['result', 'data'],
            description:
                "The feature's applicable strategies and cumulative results of the strategies",
            properties: {
                result: {
                    description: `The cumulative results of all the feature's strategies. Can be \`true\`,
                                  \`false\`, or \`${playgroundStrategyEvaluation.unknownResult}\`.
                                  This property will only be \`${playgroundStrategyEvaluation.unknownResult}\`
                                  if one or more of the strategies can't be fully evaluated and the rest of the strategies
                                  all resolve to \`false\`.`,
                    anyOf: [
                        { type: 'boolean' },
                        {
                            type: 'string',
                            enum: [playgroundStrategyEvaluation.unknownResult],
                        },
                    ],
                },
                data: {
                    description: 'The strategies that apply to this feature.',
                    type: 'array',
                    items: {
                        $ref: playgroundStrategySchema.$id,
                    },
                },
            },
        },
        hasUnsatisfiedDependency: {
            type: 'boolean',
            description:
                'Whether the feature has a parent dependency that is not satisfied',
        },
        isEnabledInCurrentEnvironment: {
            type: 'boolean',
            description:
                'Whether the feature is active and would be evaluated in the provided environment in a normal SDK context.',
        },
        isEnabled: {
            description: `Whether this feature is enabled or not in the current environment.
                          If a feature can't be fully evaluated (that is, \`strategies.result\` is \`${playgroundStrategyEvaluation.unknownResult}\`),
                          this will be \`false\` to align with how client SDKs treat unresolved feature states.`,
            type: 'boolean',
            example: true,
        },
        variant: {
            description: `The feature variant you receive based on the provided context or the _disabled
                          variant_. If a feature is disabled or doesn't have any
                          variants, you would get the _disabled variant_.
                          Otherwise, you'll get one of thefeature's defined variants.`,
            type: 'object',
            additionalProperties: false,
            required: ['name', 'enabled'],
            properties: {
                name: {
                    type: 'string',
                    description:
                        "The variant's name. If there is no variant or if the flag is disabled, this will be `disabled`",
                    example: 'red-variant',
                },
                enabled: {
                    type: 'boolean',
                    description:
                        "Whether the variant is enabled or not. If the feature is disabled or if it doesn't have variants, this property will be `false`",
                },
                payload: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'value'],
                    description: 'An optional payload attached to the variant.',
                    properties: {
                        type: {
                            description: 'The format of the payload.',
                            type: 'string',
                        },
                        value: {
                            type: 'string',
                            description: 'The payload value stringified.',
                            example: '{"property": "value"}',
                        },
                    },
                },
                feature_enabled: {
                    type: 'boolean',
                    description: 'Use `featureEnabled` instead.',
                    example: true,
                },
                featureEnabled: {
                    deprecated: true,
                    type: 'boolean',
                    description: 'Whether the feature is enabled or not.',
                    example: true,
                },
            },
            nullable: true,
            example: { name: 'green', enabled: true },
        },
        variants: {
            type: 'array',
            description: 'The feature variants.',
            items: { $ref: variantSchema.$id },
        },
    },
    components: {
        schemas: {
            playgroundStrategySchema,
            playgroundConstraintSchema,
            playgroundSegmentSchema,
            parametersSchema,
            variantSchema,
            overrideSchema,
        },
        variants: { type: 'array', items: { $ref: variantSchema.$id } },
    },
} as const;

export type PlaygroundFeatureSchema = FromSchema<
    typeof playgroundFeatureSchema
>;
