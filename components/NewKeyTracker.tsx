import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';


interface KeyTrackerProps {
    onKeyPress: (key: string) => void;
    leftKeySequence: React.MutableRefObject<{ key: string; time: number }[]>;
    rightKeySequence: React.MutableRefObject<{ key: string; time: number }[]>;
    lastKeySide: React.MutableRefObject<'left' | 'right' | null>;
    regionSwitchData: React.MutableRefObject<{
        [homeKey: string]: { [key1: string]: { [key2: string]: number[] } }
    }>;
}

type FingerRegions = {
    [key: string]: string[];
};

type KeyboardMap = {
    leftHomeKeys: string[];
    rightHomeKeys: string[];
    leftKeys: string[];
    rightKeys: string[];
    leftFingerRegions: FingerRegions;
    rightFingerRegions: FingerRegions;
};

const keyboardMap: KeyboardMap = {
    leftHomeKeys: ['a', 's', 'd', 'f'],
    rightHomeKeys: ['j', 'k', 'l', 'ö', 'ä'],
    leftKeys: ["a", "q", "y", "<", "1", "s", "w", "x", "2", "d", "e", "c", "3", "f", "v", "b", "g", "4", "5", "r", "t"],
    rightKeys: ["j", "u", "h", "n", "m", "k", "i", "8", ",", "l", "o", "9", ".", "p", "ü", "0", "ß", "+", "#", "-", "enter", "backspace"],
    leftFingerRegions: {
        "a": ["a", "q", "y", "<", "1"],
        "s": ["s", "w", "x", "2"],
        "d": ["d", "e", "c", "3"],
        "f": ["f", "v", "b", "g", "4", "5", "r", "t"]
    },
    rightFingerRegions: {
        "j": ["j", "u", "h", "n", "m"],
        "k": ["k", "i", "8", ","],
        "l": ["l", "o", "9", "."],
        "ö": ["p", "ü", "0", "ß", "+", "#", "-", "enter", "backspace"]
    }
};

const NewKeyTracker: React.FC<KeyTrackerProps> = ({
    onKeyPress,
    leftKeySequence,
    rightKeySequence,
    lastKeySide,
    regionSwitchData
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Function to handle keyDown event
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        onKeyPress(event.key);
        const key = event.key.toLowerCase();

        // Check which side the key belongs to
        if (keyboardMap.leftKeys.includes(key)) {
            if (lastKeySide.current !== 'left') {
                processSequence(rightKeySequence.current, 'right'); // Process previous right sequence
                leftKeySequence.current = [];
            }
            leftKeySequence.current.push({ key, time: Date.now() });
            lastKeySide.current = 'left';
        } else if (keyboardMap.rightKeys.includes(key)) {
            if (lastKeySide.current !== 'right') {
                processSequence(leftKeySequence.current, 'left'); // Process previous left sequence
                rightKeySequence.current = [];
            }
            rightKeySequence.current.push({ key, time: Date.now() });
            lastKeySide.current = 'right';
        }
    }, [onKeyPress, leftKeySequence, rightKeySequence, lastKeySide]);

    // Function to process sequence and filter for finger region switches
    function processSequence(sequence: { key: string, time: number }[], side: 'left' | 'right') {
        if (sequence.length < 2) return;

        const regionSwitches = filterRegionSwitches(sequence);
        calculateRegionSwitchSpeed(regionSwitches, side);
    }

    // Filter function to keep only finger region switches
    function filterRegionSwitches(sequence: { key: string, time: number }[]) {
        const switches = [];
        for (let i = 1; i < sequence.length; i++) {
            if (sequence[i - 1].key !== sequence[i].key && inDifferentRegion(sequence[i - 1].key, sequence[i].key)) {
                switches.push(sequence[i - 1], sequence[i]);
            }
        }
        return switches;
    }

    // Check if two keys are in different regions
    function inDifferentRegion(key1: string, key2: string) {
        const getFingerRegion = (key: string) => {
            for (const [finger, keys] of Object.entries(keyboardMap.leftFingerRegions)) {
                if (keys.includes(key.toLowerCase())) return finger;
            }
            for (const [finger, keys] of Object.entries(keyboardMap.rightFingerRegions)) {
                if (keys.includes(key.toLowerCase())) return finger;
            }
            return null;
        };

        const region1 = getFingerRegion(key1);
        const region2 = getFingerRegion(key2);

        return region1 !== region2;
    }

    // Calculate average region switch speed and attribute it to the relevant home key
    function calculateRegionSwitchSpeed(regionSwitches: { key: string, time: number }[], side: "left" | "right") {
        for (let i = 0; i < regionSwitches.length - 1; i++) {
            const { key: key1, time: time1 } = regionSwitches[i];
            const { key: key2, time: time2 } = regionSwitches[i + 1];
            const timeDiff = time2 - time1;

            const homeKey = getHomeKeyForRegion(key1, side);
            if (!homeKey) {
                throw new Error(`Home key not found for ${key1} on ${side}`);
            }
            updateRegionSwitchData(homeKey, key1, key2, timeDiff);
        }
    }

    // Modified function to update data store with new time difference
    function updateRegionSwitchData(homeKey: string, key1: string, key2: string, timeDiff: number) {
        // Skip self-switches
        if (key1 === key2) {
            return;
        }

        const data = regionSwitchData.current;
        if (!data[homeKey]) {
            data[homeKey] = {};
        }
        if (!data[homeKey][key1]) {
            data[homeKey][key1] = {};
        }
        if (!data[homeKey][key1][key2]) {
            data[homeKey][key1][key2] = [];
        }
        data[homeKey][key1][key2].push(timeDiff);
    }

    // Function to map region to home key
    function getHomeKeyForRegion(key: string, side: "left" | "right"): string {
        const lowerKey = key.toLowerCase();
        const fingerRegions = side === "left" ? keyboardMap.leftFingerRegions : keyboardMap.rightFingerRegions;

        for (const [homeKey, keys] of Object.entries(fingerRegions)) {
            if (keys.includes(lowerKey)) {
                return homeKey;
            }
        }

        // If the key is not found in any region, return an empty string or handle the error as needed
        return "";
    }

    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.focus();
            inputElement.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            if (inputElement) {
                inputElement.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [handleKeyDown]);

    // TODO: Add a function to process the timeMap
    function processTimeMap() {
        const processedData = Object.entries(regionSwitchData.current).reduce((acc, [homeKey, keyData]) => {
            acc[homeKey] = Object.entries(keyData).reduce((keyAcc, [key1, key2Data]) => {
                keyAcc[key1] = Object.entries(key2Data).reduce((key2Acc, [key2, timeDiffs]) => {
                    const average = timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
                    const stdDev = calculateStandardDeviation(timeDiffs, average);
                    key2Acc[key2] = { average, stdDev };
                    return key2Acc;
                }, {} as Record<string, { average: number; stdDev: number }>);
                return keyAcc;
            }, {} as Record<string, Record<string, { average: number; stdDev: number }>>);
            return acc;
        }, {} as Record<string, Record<string, Record<string, { average: number; stdDev: number }>>>);

        console.log(processedData);
        inputRef.current?.focus();
    }

    function calculateStandardDeviation(numbers: number[], mean: number): number {
        if (numbers.length < 2) return 0;

        const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (numbers.length - 1);
        return Math.sqrt(variance);
    }

    return (
        <div>
            <Button onClick={processTimeMap}>Show Stats</Button>
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
};

export default NewKeyTracker;
