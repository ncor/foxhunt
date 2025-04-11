export type Vector<N extends number> = number[] & {
    norm: N;
    lerp(to: Vector<N>, t: number): Vector<N>;
    round(): Vector<N>;
    scale(by: number): Vector<N>;
    multiply(right: Vector<N>): Vector<N>;
    substract(right: Vector<N>): Vector<N>;
    isEqualTo(right: Vector<N>): boolean;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const vector = <N extends number>(
    norm: N,
    values: number[],
): Vector<N> => {
    const mapComponentPairs = (
        right: Vector<N>,
        fn: (a: number, b: number) => number,
    ) =>
        vector(
            norm,
            values.map((value, index) => fn(value, right[index])),
        );

    return Object.assign(values, {
        norm,
        lerp: (to: Vector<N>, t: number) =>
            mapComponentPairs(to, (a, b) => lerp(a, b, t)),
        round: () => vector(norm, values.map(Math.round)),
        scale: (by: number) =>
            vector(
                norm,
                values.map((value) => value * by),
            ),
        multiply: (right: Vector<N>) =>
            mapComponentPairs(right, (a, b) => a * b),
        substract: (right: Vector<N>) =>
            mapComponentPairs(right, (a, b) => a - b),
        isEqualTo: (right: Vector<N>) =>
            values.every((value, index) => value === right[index]),
    });
};

export const vector2 = (x: number, y: number) => vector(2, [x, y]);

export const vector4 = (x: number, y: number, z: number, w: number) =>
    vector(4, [x, y, z, w]);
