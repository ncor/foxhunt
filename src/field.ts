import { type Vector, vector2 } from "./shared/lib/vector";

export type FieldValue = {
    hasTarget: boolean;
    surroundingTargetsCount: number;
};

const indexToPosition = (index: number, dimensions: Vector<2>) =>
    vector2(index % dimensions[0], Math.floor(index / dimensions[0]));

export const positionToIndex = (position: Vector<2>, dimensions: Vector<2>) =>
    dimensions[1] * position[1] + position[0];

const makeEmptyFieldValues = (dimensions: Vector<2>): FieldValue[] =>
    Array.from({ length: dimensions[0] * dimensions[1] }, (_, index) => ({
        position: indexToPosition(index, dimensions),
        hasTarget: false,
        surroundingTargetsCount: 0,
    }));

const generateTargetPositions = (
    fieldDimensions: Vector<2>,
    numberOfTargets: number,
): Vector<2>[] => {
    const maxPosition = fieldDimensions.substract(vector2(1, 1));
    const positions: Vector<2>[] = [];

    while (positions.length < numberOfTargets) {
        const newPosition = maxPosition
            .multiply(vector2(Math.random(), Math.random()))
            .round();

        if (!positions.find((position) => position.isEqualTo(newPosition)))
            positions.push(newPosition);
    }

    return positions;
};

const countSurroundingTargetsAlongAxes = (
    position: Vector<2>,
    targetPositions: Vector<2>[],
) =>
    targetPositions.reduce(
        (count, targetPosition) =>
            count +
            (targetPosition[0] === position[0] ||
            targetPosition[1] === position[1] ||
            targetPosition[0] - targetPosition[1] ===
                position[0] - position[1] ||
            targetPosition[0] + targetPosition[1] === position[0] + position[1]
                ? 1
                : 0),
        0,
    );

export const generateInitialFieldValues = (
    dimensions: Vector<2>,
    numberOfTargets: number,
): FieldValue[] => {
    const values = makeEmptyFieldValues(dimensions);

    const targetPositions = generateTargetPositions(
        dimensions,
        numberOfTargets,
    );

    for (const targetIndex of targetPositions.map((targetPosition) =>
        positionToIndex(targetPosition, dimensions),
    ))
        values[targetIndex].hasTarget = true;

    for (const [index, value] of values.entries())
        value.surroundingTargetsCount = countSurroundingTargetsAlongAxes(
            indexToPosition(index, dimensions),
            targetPositions,
        );

    return values;
};
