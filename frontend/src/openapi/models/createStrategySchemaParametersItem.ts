/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { CreateStrategySchemaParametersItemType } from './createStrategySchemaParametersItemType.js';

export type CreateStrategySchemaParametersItem = {
    /** A description of this strategy parameter. Use this to indicate to the users what the parameter does. */
    description?: string;
    /** The name of the parameter */
    name: string;
    /** Whether this parameter must be configured when using the strategy. Defaults to `false` */
    required?: boolean;
    /** The [type of the parameter](https://docs.getunleash.io/reference/custom-activation-strategies#parameter-types) */
    type: CreateStrategySchemaParametersItemType;
};
