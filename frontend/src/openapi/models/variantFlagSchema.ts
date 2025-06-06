/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { VariantFlagSchemaPayload } from './variantFlagSchemaPayload.js';

/**
 * A representation of an evaluated Unleash feature variant.
 */
export interface VariantFlagSchema {
    /** Whether the variant is enabled or not. */
    enabled?: boolean;
    /** Whether the feature is enabled or not. */
    feature_enabled?: boolean;
    /**
     * Use `feature_enabled` instead.
     * @deprecated
     */
    featureEnabled?: boolean;
    /** The name of the variant. Will always be disabled if `enabled` is false. */
    name?: string;
    /** Additional data associated with this variant. */
    payload?: VariantFlagSchemaPayload;
}
