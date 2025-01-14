'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { KeyColor, MarkdownFile, ViewState } from '@/lib/projectTypes';
import { getStorageFiles } from '@/lib/firebase/storage';

interface KeyboardContextType {
    // Internal state (prefixed with _)
    _files: MarkdownFile[];
    _loading: boolean;
    _selectedFile: MarkdownFile | null;
    _viewState: ViewState;
    _containerHeight: string;
    _keyColors: { [key: string]: KeyColor };
    _processing: boolean;

    // Action handlers
    handleFileSelect: (file: MarkdownFile) => void;
    handleKeyColorsUpdate: (colors: { [key: string]: KeyColor }) => void;
    handleTrainingComplete: () => void;
    handleTrainingReset: () => void;
    handleBackToFiles: () => void;
    handleProcessingFinished: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
    // Internal state
    const [_files, _setFiles] = useState<MarkdownFile[]>([]);
    const [_loading, _setLoading] = useState(true);
    const [_selectedFile, _setSelectedFile] = useState<MarkdownFile | null>(null);
    const [_viewState, _setViewState] = useState<ViewState>('selecting');
    const [_containerHeight, _setContainerHeight] = useState('80vh');
    const [_keyColors, _setKeyColors] = useState<{ [key: string]: KeyColor }>({});
    const [_processing, _setProcessing] = useState(false);

    useEffect(() => {
        const updateContainerHeight = () => {
            const windowHeight = window.innerHeight;
            const newHeight = windowHeight - (windowHeight * 0.2);
            _setContainerHeight(`${newHeight}px`);
        };

        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);
        return () => window.removeEventListener('resize', updateContainerHeight);
    }, []);

    useEffect(() => {
        async function loadFiles() {
            try {
                const loadedFiles = await getStorageFiles();
                _setFiles(loadedFiles);
            } catch (error) {
                console.error('Error loading files:', error);
            } finally {
                _setLoading(false);
            }
        }

        loadFiles();
    }, []);

    // Action handlers
    const handleFileSelect = (file: MarkdownFile) => {
        console.log('File selected:', file.name);
        _setSelectedFile(file);
        _setViewState('selected');
    };


    const handleKeyColorsUpdate = (colors: { [key: string]: KeyColor }) => {
        console.log('Key colors updated');
        _setKeyColors(colors);
    };

    const handleTrainingComplete = () => {
        console.log('Training completed');
        _setProcessing(true);
    };
    const handleProcessingFinished = () => {
        console.log('Processing finished');
        _setProcessing(false);
        _setViewState('finished');
    };

    const handleTrainingReset = () => {
        console.log('Training reset');
        _setSelectedFile(null);
        _setViewState('selecting');
        _setKeyColors({});
    };

    const handleBackToFiles = () => {
        console.log('Navigating back to files');
        _setSelectedFile(null);
        _setViewState('selecting');
    };

    const value = {
        // Expose internal state
        _files,
        _loading,
        _selectedFile,
        _viewState,
        _containerHeight,
        _keyColors,
        _processing,

        // Expose action handlers
        handleFileSelect,
        handleKeyColorsUpdate,
        handleTrainingComplete,
        handleTrainingReset,
        handleBackToFiles,
        handleProcessingFinished
    };

    return (
        <KeyboardContext.Provider value={value}>
            {children}
        </KeyboardContext.Provider>
    );
}

export function useKeyboard() {
    const context = useContext(KeyboardContext);
    if (context === undefined) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
} 