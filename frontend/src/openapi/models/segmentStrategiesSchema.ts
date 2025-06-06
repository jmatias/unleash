/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { SegmentStrategiesSchemaChangeRequestStrategiesItem } from './segmentStrategiesSchemaChangeRequestStrategiesItem.js';
import type { SegmentStrategiesSchemaStrategiesItem } from './segmentStrategiesSchemaStrategiesItem.js';

/**
 * A collection of strategies belonging to a specified segment.
 */
export interface SegmentStrategiesSchema {
    /** A list of strategies that use this segment in active change requests. */
    changeRequestStrategies?: SegmentStrategiesSchemaChangeRequestStrategiesItem[];
    /** The list of strategies */
    strategies: SegmentStrategiesSchemaStrategiesItem[];
}
