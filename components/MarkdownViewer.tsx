'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import NewKeyTracker from './NewKeyTracker' // Import the NewKeyTracker component instead of KeyTracker
import { Button } from './ui/button'

interface MarkdownViewerProps {
    content: string
}

interface ContentBatch {
    type: 'p' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol'
    content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
    const [typedText, setTypedText] = useState('')
    const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
    const [lastInput, setLastInput] = useState('')
    const missingCharRef = useRef<HTMLSpanElement>(null)

    const keyPressTimes = useRef<{ [key: string]: { keyUpTime?: number } }>({}).current;
    const timeMap = useRef<{ [key: string]: { [key: string]: { total: number, count: number, times: number[] } } }>({}).current;

    // Add these new refs

    const leftKeySequenceRef = useRef<{ key: string; time: number }[]>([]);
    const rightKeySequenceRef = useRef<{ key: string; time: number }[]>([]);
    const lastKeySideRef = useRef<'left' | 'right' | null>(null);
    const regionSwitchDataRef = useRef<{
        [homeKey: string]: { [key1: string]: { [key2: string]: number[] } }
    }>({});


    const contentBatches = useMemo(() => {
        const batches: ContentBatch[] = []
        const lines = content.split('\n')
        let currentBatch: ContentBatch | null = null

        lines.forEach((line, index) => {
            if (line.trim() === '') {
                if (currentBatch) {
                    currentBatch.content += '\n'
                    batches.push(currentBatch)
                    currentBatch = null
                } else {
                    batches.push({ type: 'p', content: '\n' })
                }
            } else if (line.startsWith('# ')) {
                if (currentBatch) batches.push(currentBatch)
                currentBatch = { type: 'h1', content: line + '\n' }
            } else if (line.startsWith('## ')) {
                if (currentBatch) batches.push(currentBatch)
                currentBatch = { type: 'h2', content: line + '\n' }
            } else if (line.startsWith('### ')) {
                if (currentBatch) batches.push(currentBatch)
                currentBatch = { type: 'h3', content: line + '\n' }
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                if (currentBatch && currentBatch.type !== 'ul') {
                    batches.push(currentBatch)
                    currentBatch = { type: 'ul', content: line + '\n' }
                } else if (currentBatch) {
                    currentBatch.content += line + '\n'
                } else {
                    currentBatch = { type: 'ul', content: line + '\n' }
                }
            } else if (line.match(/^\d+\. /)) {
                if (currentBatch && currentBatch.type !== 'ol') {
                    batches.push(currentBatch)
                    currentBatch = { type: 'ol', content: line + '\n' }
                } else if (currentBatch) {
                    currentBatch.content += line + '\n'
                } else {
                    currentBatch = { type: 'ol', content: line + '\n' }
                }
            } else {
                if (currentBatch && currentBatch.type !== 'p') {
                    batches.push(currentBatch)
                    currentBatch = { type: 'p', content: line + '\n' }
                } else if (currentBatch) {
                    currentBatch.content += line + '\n'
                } else {
                    currentBatch = { type: 'p', content: line + '\n' }
                }
            }
        })

        if (currentBatch) batches.push(currentBatch)
        return batches
    }, [content])

    const handleKeyPress = useCallback((key: string) => {
        const currentBatch = contentBatches[currentBatchIndex]
        const nextRequiredChar = currentBatch.content[typedText.length]

        if (nextRequiredChar === '\n' && key === 'Enter') {
            setTypedText(prev => prev + '\n')
            setLastInput('↵')
        } else if (key === nextRequiredChar) {
            setTypedText(prev => prev + key)
            setLastInput(key)
        }

        if (typedText.length + 1 === currentBatch.content.length) {
            // Move to the next batch
            if (currentBatchIndex < contentBatches.length - 1) {
                setCurrentBatchIndex(prevIndex => prevIndex + 1)
                setTypedText('')
            } else {
                // Finished all batches
                console.log("Finished all content")
            }
        }
    }, [contentBatches, currentBatchIndex, typedText])

    const renderBatch = (batch: ContentBatch, index: number) => {
        const isCurrentBatch = index === currentBatchIndex
        const content = batch.content.split('').map((char, charIndex) => {
            const isTyped = isCurrentBatch && charIndex < typedText.length
            const isMissingChar = isCurrentBatch && charIndex === typedText.length
            let displayChar = char
            if (char === '\n') {
                displayChar = '↵\n'
            }
            return (
                <span
                    key={charIndex}
                    ref={isMissingChar ? missingCharRef : null}
                    style={{
                        backgroundColor: isCurrentBatch ? 'hsl(var(--secondary))' : 'inherit',
                        opacity: isTyped ? 1 : 0.5,
                        color: isTyped ? 'green' : 'inherit',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {displayChar}
                </span>
            )
        })

        switch (batch.type) {
            case 'h1':
                return <h1 key={index} className="text-2xl font-bold mb-4">{content}</h1>
            case 'h2':
                return <h2 key={index} className="text-xl font-semibold mb-3">{content}</h2>
            case 'h3':
                return <h3 key={index} className="text-lg font-medium mb-2">{content}</h3>
            case 'ul':
                return <ul key={index} className="list-disc pl-5 mb-4">{content}</ul>
            case 'ol':
                return <ol key={index} className="list-decimal pl-5 mb-4">{content}</ol>
            default:
                return <p key={index}>{content}</p>
        }
    }

    const getNextRequiredInput = () => {
        const currentBatch = contentBatches[currentBatchIndex]
        const nextChar = currentBatch.content[typedText.length]
        return nextChar === '\n' ? '↵' : nextChar || ''
    }

    useEffect(() => {
        if (missingCharRef.current) {
            missingCharRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [typedText, currentBatchIndex])



    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between mb-2 h-16">
                <Card className="w-32">
                    <CardContent className="flex p-6 items-center justify-center h-full">
                        <span className="text-4xl font-bold">{lastInput || ' '}</span>
                    </CardContent>
                </Card>
                <Card className="w-32">
                    <CardContent className="flex p-6 items-center justify-center h-full">
                        <span className="text-4xl font-bold">{getNextRequiredInput()}</span>
                    </CardContent>
                </Card>
            </div>
            <Card className="flex-grow overflow-hidden">
                <CardContent className="p-6 h-full">
                    <ScrollArea className="h-full pr-4 overflow-auto">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            {contentBatches.map(renderBatch)}
                        </div>
                    </ScrollArea>

                    <NewKeyTracker
                        onKeyPress={handleKeyPress}
                        leftKeySequence={leftKeySequenceRef}
                        rightKeySequence={rightKeySequenceRef}
                        lastKeySide={lastKeySideRef}
                        regionSwitchData={regionSwitchDataRef}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
