/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { ActionDefinitionParameterSchema } from './actionDefinitionParameterSchema.js';

/**
 * Configuration of a single action and its parameters.
 */
export interface ActionDefinitionSchema {
    /** The category of the action. */
    category: string;
    /** A description for the action. */
    description: string;
    /** The label of the action. */
    label: string;
    /** The parameters required to perform the action. */
    parameters: ActionDefinitionParameterSchema[];
    /** The permissions required to perform the action. */
    permissions: string[];
}
