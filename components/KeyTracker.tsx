import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';

interface KeyTrackerProps {
    onKeyPress: (key: string) => void;
    keyPressTimes: { [key: string]: { keyUpTime?: number } };
    timeMap: { [key: string]: { [key: string]: { total: number, count: number, times: number[] } } };
}

const KeyTracker: React.FC<KeyTrackerProps> = ({ onKeyPress, keyPressTimes, timeMap }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const homeRow = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'];

    const handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const currentTime = event.timeStamp;

        // If the key is a home row letter, record keyUp time
        if (homeRow.includes(key)) {
            keyPressTimes[key] = { keyUpTime: currentTime };  // Store keyUp time
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        onKeyPress(event.key);
        const nextKey = event.key.toLowerCase();
        const currentTime = event.timeStamp;

        // Check if any home row key was recently released
        for (let key in keyPressTimes) {
            if (keyPressTimes[key].keyUpTime) {
                const timeDiff = currentTime - keyPressTimes[key].keyUpTime;

                console.log("Updating")
                updateTimeMap(key, nextKey, timeDiff);
                delete keyPressTimes[key].keyUpTime;
            }
        }
    };

    const updateTimeMap = (key: string, nextKey: string, timeDiff: number) => {
        if (!timeMap[key]) {
            timeMap[key] = {};
        }

        if (!timeMap[key][nextKey]) {
            // Initialize with the first time difference
            timeMap[key][nextKey] = { total: timeDiff, count: 1, times: [timeDiff] };
        } else {
            // Update running average and store times for deviation calculation
            let data = timeMap[key][nextKey];
            data.total += timeDiff;
            data.count++;
            data.times.push(timeDiff);
        }
    };

    const processTimeMap = () => {
        const stats: { [key: string]: { [key: string]: { avgTime: number, deviation: number } } } = {};

        for (let key in timeMap) {
            stats[key] = {};

            for (let nextKey in timeMap[key]) {
                const data = timeMap[key][nextKey];
                const avgTime = data.total / data.count;

                // Calculate standard deviation
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
    }, [handleKeyDown]);

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
