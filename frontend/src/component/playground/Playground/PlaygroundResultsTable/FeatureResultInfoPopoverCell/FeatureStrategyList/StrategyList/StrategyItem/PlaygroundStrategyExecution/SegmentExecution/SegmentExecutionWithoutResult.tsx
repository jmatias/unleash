import { Fragment, type VFC } from 'react';
import type { PlaygroundSegmentSchema } from 'openapi';
import { StrategySeparator } from 'component/common/StrategySeparator/LegacyStrategySeparator';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { SegmentItem } from 'component/common/SegmentItem/LegacySegmentItem';
import { ConstraintExecutionWithoutResults } from '../ConstraintExecution/ConstraintExecutionWithoutResults.tsx';

interface ISegmentExecutionWithoutResultProps {
    segments?: PlaygroundSegmentSchema[];
}

export const SegmentExecutionWithoutResult: VFC<
    ISegmentExecutionWithoutResultProps
> = ({ segments }) => {
    if (!segments) return null;

    return (
        <>
            {segments.map((segment, index) => (
                <Fragment key={segment.id}>
                    <SegmentItem
                        segment={segment}
                        constraintList={
                            <ConstraintExecutionWithoutResults
                                constraints={segment.constraints}
                            />
                        }
                        isExpanded
                        disabled
                    />
                    <ConditionallyRender
                        condition={
                            // Add IF there is a next segment
                            index >= 0 &&
                            segments.length > 1 &&
                            // Don't add if it's the last segment item
                            index !== segments.length - 1
                        }
                        show={<StrategySeparator text='AND' />}
                    />
                </Fragment>
            ))}
        </>
    );
};
