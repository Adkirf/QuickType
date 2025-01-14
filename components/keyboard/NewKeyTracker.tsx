import React, { useEffect, useRef, useCallback } from 'react';
import { useKeyboard } from '../context/KeyboardContext';
import { ProcessedKeyData, KeyTimingStats, KeyColor } from '@/lib/projectTypes';

interface KeyTrackerProps {
    onKeyPress: (key: string) => void;
    leftKeySequence: React.MutableRefObject<{ key: string; time: number }[]>;
    rightKeySequence: React.MutableRefObject<{ key: string; time: number }[]>;
    lastKeySide: React.MutableRefObject<'left' | 'right' | null>;
    regionSwitchData: React.MutableRefObject<{
        [homeKey: string]: { [key1: string]: { [key2: string]: number[] } }
    }>;
    triggerProcessing?: boolean;
}


const keyboardMap = {
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
    regionSwitchData,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleKeyColorsUpdate, _processing, handleProcessingFinished } = useKeyboard();

    const calculateStandardDeviation = (numbers: number[], mean: number): number => {
        if (numbers.length < 2) return 0;
        const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (numbers.length - 1);
        return Math.sqrt(variance);
    };

    const processKeyboardData = useCallback(async (data: ProcessedKeyData) => {
        console.log('Processing keyboard data:', data);
        const keyPerformance: { [key: string]: number } = {};

        // Initialize all keys with default performance
        const allKeys = [
            ...Object.values(keyboardMap.leftFingerRegions).flat(),
            ...Object.values(keyboardMap.rightFingerRegions).flat()
        ];

        const keyColors: { [key: string]: KeyColor } = {};
        allKeys.forEach(key => {
            keyColors[key] = 'default';
        });

        // Calculate average time for each key
        Object.values(data).forEach(homeKeyData => {
            Object.entries(homeKeyData).forEach(([key1, transitions]) => {
                if (!keyPerformance[key1]) {
                    keyPerformance[key1] = Infinity;
                }

                const times = Object.values(transitions).map(stats => stats.average);
                if (times.length > 0) {
                    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
                    keyPerformance[key1] = Math.min(keyPerformance[key1], avgTime);
                }
            });
        });

        // Remove Infinity values for unused keys
        Object.keys(keyPerformance).forEach(key => {
            if (keyPerformance[key] === Infinity) {
                delete keyPerformance[key];
            }
        });

        // Calculate colors based on performance
        if (Object.keys(keyPerformance).length > 0) {
            const sortedTimes = Object.entries(keyPerformance)
                .sort(([, timeA], [, timeB]) => timeA - timeB);

            const totalKeys = sortedTimes.length;
            const quarterIndex = Math.floor(totalKeys / 4);
            const threeQuarterIndex = Math.floor(totalKeys * 3 / 4);

            sortedTimes.forEach(([key], index) => {
                if (index < quarterIndex) {
                    keyColors[key] = 'green';
                } else if (index >= threeQuarterIndex) {
                    keyColors[key] = 'red';
                } else {
                    keyColors[key] = 'yellow';
                }
            });
        }
        handleKeyColorsUpdate(keyColors);
        handleProcessingFinished();

    }, [handleKeyColorsUpdate, handleProcessingFinished]);

    // Move filterRegionSwitches into useCallback
    const filterRegionSwitches = useCallback((sequence: { key: string, time: number }[]) => {
        const switches = [];
        for (let i = 1; i < sequence.length; i++) {
            if (sequence[i - 1].key !== sequence[i].key && inDifferentRegion(sequence[i - 1].key, sequence[i].key)) {
                switches.push(sequence[i - 1], sequence[i]);
            }
        }
        return switches;
    }, []); // No dependencies needed as it only uses internal functions

    // Move calculateRegionSwitchSpeed into useCallback
    const calculateRegionSwitchSpeed = useCallback((regionSwitches: { key: string, time: number }[], side: "left" | "right") => {
        for (let i = 0; i < regionSwitches.length - 1; i += 2) {
            const { key: key1 } = regionSwitches[i];
            const { key: key2, time: time2 } = regionSwitches[i + 1];
            const time1 = regionSwitches[i].time;
            const timeDiff = time2 - time1;

            const homeKey = getHomeKeyForRegion(key1, side);
            if (!homeKey) {
                console.warn(`Home key not found for ${key1} on ${side}`);
                continue;
            }

            if (!regionSwitchData.current[homeKey]) {
                regionSwitchData.current[homeKey] = {};
            }
            if (!regionSwitchData.current[homeKey][key1]) {
                regionSwitchData.current[homeKey][key1] = {};
            }
            if (!regionSwitchData.current[homeKey][key1][key2]) {
                regionSwitchData.current[homeKey][key1][key2] = [];
            }

            regionSwitchData.current[homeKey][key1][key2].push(timeDiff);
        }
    }, [regionSwitchData]); // Only depend on regionSwitchData

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

    // Function to handle keyDown event
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        onKeyPress(event.key);
        const key = event.key.toLowerCase();
        const currentTime = Date.now();

        if (keyboardMap.leftKeys.includes(key)) {
            leftKeySequence.current.push({ key, time: currentTime });
            if (leftKeySequence.current.length >= 2) {
                const switches = filterRegionSwitches(leftKeySequence.current);
                calculateRegionSwitchSpeed(switches, 'left');
            }
            lastKeySide.current = 'left';
        } else if (keyboardMap.rightKeys.includes(key)) {
            rightKeySequence.current.push({ key, time: currentTime });
            if (rightKeySequence.current.length >= 2) {
                const switches = filterRegionSwitches(rightKeySequence.current);
                calculateRegionSwitchSpeed(switches, 'right');
            }
            lastKeySide.current = 'right';
        }
    }, [
        onKeyPress,
        calculateRegionSwitchSpeed,
        filterRegionSwitches,
        lastKeySide,
        leftKeySequence,
        rightKeySequence
    ]);

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

    const processTimeMap = useCallback(() => {
        if (lastKeySide.current === 'left' && leftKeySequence.current.length >= 2) {
            const switches = filterRegionSwitches(leftKeySequence.current);
            calculateRegionSwitchSpeed(switches, 'left');
        } else if (lastKeySide.current === 'right' && rightKeySequence.current.length >= 2) {
            const switches = filterRegionSwitches(rightKeySequence.current);
            calculateRegionSwitchSpeed(switches, 'right');
        }

        const processedData = Object.entries(regionSwitchData.current).reduce((acc, [homeKey, keyData]) => {
            acc[homeKey] = Object.entries(keyData).reduce((keyAcc, [key1, key2Data]) => {
                keyAcc[key1] = Object.entries(key2Data).reduce((key2Acc, [key2, timeDiffs]) => {
                    if (timeDiffs.length > 0) {
                        const average = timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
                        const stdDev = calculateStandardDeviation(timeDiffs, average);
                        key2Acc[key2] = { average, stdDev };
                    }
                    return key2Acc;
                }, {} as Record<string, KeyTimingStats>);
                return keyAcc;
            }, {} as Record<string, Record<string, KeyTimingStats>>);
            return acc;
        }, {} as ProcessedKeyData);

        processKeyboardData(processedData);
    }, [
        calculateRegionSwitchSpeed,
        filterRegionSwitches,
        lastKeySide,
        leftKeySequence,
        processKeyboardData,
        regionSwitchData,
        rightKeySequence
    ]);

    useEffect(() => {

        if (_processing) {
            processTimeMap();
        }
    }, [_processing, processTimeMap]);

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute z-[-10] top-0 left-0 w-full h-full"
            />
        </div>
    );
};

export default NewKeyTracker;
