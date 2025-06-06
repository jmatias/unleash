/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { SdkContextSchema } from './sdkContextSchema.js';
import type { AdvancedPlaygroundRequestSchemaProjects } from './advancedPlaygroundRequestSchemaProjects.js';

/**
 * Data for the playground API to evaluate toggles in advanced mode with environment and context multi selection
 */
export interface AdvancedPlaygroundRequestSchema {
    context: SdkContextSchema;
    /**
     * The environments to evaluate toggles in.
     * @minItems 1
     */
    environments: string[];
    /** A list of projects to check for toggles in. */
    projects?: AdvancedPlaygroundRequestSchemaProjects;
}
