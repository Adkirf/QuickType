import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';

interface KeyTrackerProps {
    onKeyPress: (key: string) => void;
    keyPressTimes: { [key: string]: { keyUpTime?: number } };
    timeMap: { [key: string]: { [key: string]: { total: number, count: number, times: number[] } } };
}

const KeyTracker: React.FC<KeyTrackerProps> = ({ onKeyPress, keyPressTimes, timeMap }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const homeRow = useMemo(() => ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'], []);

    const updateTimeMap = useCallback((key: string, nextKey: string, timeDiff: number) => {
        if (!timeMap[key]) {
            timeMap[key] = {};
        }

        if (!timeMap[key][nextKey]) {
            timeMap[key][nextKey] = { total: timeDiff, count: 1, times: [timeDiff] };
        } else {
            const data = timeMap[key][nextKey];
            data.total += timeDiff;
            data.count++;
            data.times.push(timeDiff);
        }
    }, [timeMap]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const currentTime = event.timeStamp;

        if (homeRow.includes(key)) {
            keyPressTimes[key] = { keyUpTime: currentTime };
        }
    }, [keyPressTimes, homeRow]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        onKeyPress(event.key);
        const nextKey = event.key.toLowerCase();
        const currentTime = event.timeStamp;

        for (const key in keyPressTimes) {
            if (keyPressTimes[key].keyUpTime) {
                const timeDiff = currentTime - keyPressTimes[key].keyUpTime;
                updateTimeMap(key, nextKey, timeDiff);
                delete keyPressTimes[key].keyUpTime;
            }
        }
    }, [onKeyPress, keyPressTimes, updateTimeMap]);

    const processTimeMap = () => {
        const stats: { [key: string]: { [key: string]: { avgTime: number, deviation: number } } } = {};

        for (const key in timeMap) {
            stats[key] = {};

            for (const nextKey in timeMap[key]) {
                const data = timeMap[key][nextKey];
                const avgTime = data.total / data.count;

                const variance = data.times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / data.count;
                const deviation = Math.sqrt(variance);

                stats[key][nextKey] = { avgTime, deviation };
            }
        }

        console.log(stats);
        inputRef.current?.focus();
    }

    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.focus();
            inputElement.addEventListener('keydown', handleKeyDown);
            inputElement.addEventListener('keyup', handleKeyUp);
        }
        return () => {
            if (inputElement) {
                inputElement.removeEventListener('keydown', handleKeyDown);
                inputElement.removeEventListener('keyup', handleKeyUp);
            }
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <div>
            <Button onClick={processTimeMap}>Show Stats</Button>
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute top-0 left-0 w-px h-px"
            />
        </div>
    );
};

export default KeyTracker;
