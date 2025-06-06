import type {
    IClientSegment,
    IFeatureStrategySegment,
    ISegment,
} from '../../types/index.js';
import type { ISegmentReadModel } from './segment-read-model-type.js';

export class FakeSegmentReadModel implements ISegmentReadModel {
    constructor(private segments: ISegment[] = []) {}
    async getAll(ids?: number[]): Promise<ISegment[]> {
        return this.segments;
    }

    async getAllFeatureStrategySegments(): Promise<IFeatureStrategySegment[]> {
        return [];
    }

    async getActive(): Promise<ISegment[]> {
        return this.segments;
    }

    async getActiveForClient(): Promise<IClientSegment[]> {
        return [];
    }

    async getAllForClientIds(ids?: number[]): Promise<IClientSegment[]> {
        return [];
    }
}
