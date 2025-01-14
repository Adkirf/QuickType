export type UserProfile = {
    id: string;
    email: string;
    username?: string;
    photoURL?: string;
};



export type MarkdownFile = {
    name: string;
    url: string;
    content: string;
}

export type ViewState = 'selecting' | 'selected' | 'processing' | 'finished' | 'submitted';

export type KeyColor = 'default' | 'red' | 'yellow' | 'green'

export type KeyTimingStats = {
    average: number;
    stdDev: number;
};

export type ProcessedKeyData = {
    [homeKey: string]: {
        [key1: string]: {
            [key2: string]: KeyTimingStats;
        };
    };
};

export type KeyPerformance = {
    key: string;
    averageTime: number;
    performance: KeyColor;
};
