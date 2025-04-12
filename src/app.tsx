import clsx from "clsx";
import { RadioTowerIcon, RefreshCw, TrophyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type FieldValue, generateInitialFieldValues } from "./field";
import { type Vector, vector2, vector4 } from "./shared/lib/vector";
import { Button } from "./shared/ui/button";
import { cn } from "./shared/ui/cn";

const FIELD_DIMENSIONS = vector2(9, 9);
const NUMBER_OF_TARGETS = 5;

const COLD_COLOR_HSLA = vector4(180, 99, 61, 0.5);
const HOT_COLOR_HSLA = vector4(0, 99, 61, 1);

const DEFAULT_ICON_SIZE = 18;

const easeCircular = (x: number) => Math.sqrt(1 - (x - 1) ** 2);

const calculateHeatColor = (heatFactor: number) =>
    COLD_COLOR_HSLA.lerp(HOT_COLOR_HSLA, easeCircular(heatFactor));

const hslaToString = (hsla: Vector<4>) =>
    `hsla(${hsla[0]} ${hsla[1]}% ${hsla[2]}% / ${hsla[3]})`;

type FieldCellProps = FieldValue & {
    isChecked: boolean;
    numberOfTargets: number;
    onClick: () => void;
};

const FieldCell = (props: FieldCellProps) => {
    const heatFactor = props.surroundingTargetsCount / props.numberOfTargets;
    const heatColor = calculateHeatColor(heatFactor);

    return (
        <div
            onClick={props.onClick}
            style={{
                color: hslaToString(heatColor),
            }}
            className={cn(
                "relative group aspect-square cursor-pointer flex items-center justify-center text-5vw sm:text-4xl font-semibold rounded-sm bg-neutral-900 select-none",
                {
                    "bg-neutral-100/10 text-neutral-100!": props.hasTarget,
                },
            )}
        >
            <div
                className={cn(
                    "absolute w-full aspect-square bg-neutral-800 shadow-xl group-hover:shadow-black/45 z-10 top-0 left-0 transition-all duration-100 ease-in group-hover:z-20 pointer-events-none rounded-sm",
                    {
                        "scale-80 opacity-0": props.isChecked,
                    },
                )}
            />
            {props.isChecked &&
                (props.hasTarget ? (
                    <RadioTowerIcon className="w-1/2 h-1/2" />
                ) : (
                    props.surroundingTargetsCount
                ))}
        </div>
    );
};

type FieldProps = {
    didWin?: boolean;
    values: FieldValue[];
    dimensions: Vector<2>;
    checkedIndices: Set<number>;
    numberOfTargets: number;
    onIndexedClick: (index: number) => void;
};

const Field = (props: FieldProps) => {
    return (
        <div
            className={cn(
                "w-full aspect-square grid gap-1% opacity-100 blur-none transition-opacity,blur duration-500",
                {
                    "opacity-30 blur-sm pointer-events-none": props.didWin,
                },
            )}
            style={{
                gridTemplateColumns: `repeat(${props.dimensions[0]}, minmax(0, 1fr))`,
            }}
        >
            {props.values.map((value, index) => (
                <FieldCell
                    onClick={() => props.onIndexedClick(index)}
                    isChecked={props.checkedIndices.has(index)}
                    numberOfTargets={props.numberOfTargets}
                    key={`cell${-index}`}
                    {...value}
                />
            ))}
        </div>
    );
};

type ScoreBarProps = {
    score: number;
};

const ScoreBar = (props: ScoreBarProps) => (
    <div className="flex gap-2">
        {[...Array(NUMBER_OF_TARGETS)].map((_, index) => (
            <div
                key={`score-dot${-index}`}
                className={clsx(
                    "w-2 h-2 rounded-full",
                    index < props.score ? "bg-neutral-300" : "bg-neutral-700",
                )}
            />
        ))}
    </div>
);

type VictoryOverlayProps = {
    isVisible: boolean;
    isNewRecord: boolean;
    onTryAgain: () => void;
};

const VictoryOverlay = (props: VictoryOverlayProps) => (
    <div
        className={cn(
            "absolute w-full aspect-square flex flex-col items-center justify-center z-20 gap-4 transition-all duration-500 opacity-0 pointer-events-none",
            {
                "pointer-events-auto opacity-100": props.isVisible,
            },
        )}
    >
        <div className="flex flex-col items-center">
            <p className="font-medium text-xl">You won</p>
            {props.isNewRecord && (
                <p className="font-medium text-yellow-500">New record!</p>
            )}
        </div>
        <Button
            onClick={props.onTryAgain}
            size="lg"
            leftIcon={() => <RefreshCw size={DEFAULT_ICON_SIZE} />}
        >
            Try again
        </Button>
    </div>
);

const retrieveRecordMoves = (): number | null =>
    Number.parseInt(localStorage.getItem("record") || "") || null;

const saveRecordMoves = (moves: number) =>
    localStorage.setItem("record", moves.toString());

type RecordMovesIndicatorProps = {
    moves: number;
};

const RecordMovesIndicator = (props: RecordMovesIndicatorProps) => (
    <p className="font-medium text-yellow-600 mr-3 flex items-center gap-2">
        <TrophyIcon size={DEFAULT_ICON_SIZE} />
        {props.moves} moves
    </p>
);

type MovesIndicatorProps = {
    moves: number;
};

const MovesIndicator = (props: MovesIndicatorProps) => (
    <p className="font-medium text-neutral-300 mr-3">{props.moves} moves</p>
);

export const App = () => {
    const [fieldValues, setFieldValues] = useState(
        generateInitialFieldValues(FIELD_DIMENSIONS, NUMBER_OF_TARGETS),
    );
    const [checkedIndices, setCheckedIndices] = useState<Set<number>>(
        new Set(),
    );
    const moves = useMemo(() => checkedIndices.size, [checkedIndices]);

    const [recordMoves, setRecordMoves] = useState(retrieveRecordMoves());

    // TODO: can be optimized
    const score = useMemo(
        () =>
            [...checkedIndices].reduce(
                (score, index) =>
                    score + (fieldValues[index].hasTarget ? 1 : 0),
                0,
            ),
        [fieldValues, checkedIndices],
    );

    const isVictory = useMemo(() => score >= NUMBER_OF_TARGETS, [score]);

    const isNewRecord = useMemo(
        () => isVictory && (recordMoves == null || moves <= recordMoves),
        [isVictory, moves, recordMoves],
    );

    const handleIndexedClick = (index: number) =>
        setCheckedIndices(
            (checkedIndices) => new Set([...checkedIndices, index]),
        );

    const handleRestart = () => {
        setFieldValues(
            generateInitialFieldValues(FIELD_DIMENSIONS, NUMBER_OF_TARGETS),
        );
        setCheckedIndices(new Set());
    };

    useEffect(() => {
        if (isNewRecord) {
            setRecordMoves(moves);
            saveRecordMoves(moves);
        }
    }, [isNewRecord, moves]);

    return (
        <main className="w-screen h-screen bg-neutral-950 flex justify-center">
            <div className="w-full max-w-3xl flex flex-col justify-center px-1%">
                <div className="relative w-full aspect-square">
                    <VictoryOverlay
                        onTryAgain={handleRestart}
                        isVisible={isVictory}
                        isNewRecord={isNewRecord}
                    />
                    <Field
                        onIndexedClick={handleIndexedClick}
                        didWin={isVictory}
                        values={fieldValues}
                        dimensions={FIELD_DIMENSIONS}
                        checkedIndices={checkedIndices}
                        numberOfTargets={NUMBER_OF_TARGETS}
                    />
                </div>
                <div className="flex justify-center items-center gap-2 mt-10">
                    {recordMoves !== null && (
                        <RecordMovesIndicator moves={recordMoves} />
                    )}
                    <MovesIndicator moves={moves} />
                    <ScoreBar score={score} />
                    <Button
                        onClick={handleRestart}
                        size="lg"
                        variant="ghost"
                        leftIcon={() => <RefreshCw size={DEFAULT_ICON_SIZE} />}
                    >
                        Restart
                    </Button>
                </div>
            </div>
        </main>
    );
};
