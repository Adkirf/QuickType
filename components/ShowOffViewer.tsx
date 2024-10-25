'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentBatch {
    type: 'p' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol'
    content: string
}

export default function ShowOffViewer() {
    const [typedText, setTypedText] = useState('')
    const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
    const [lastInput, setLastInput] = useState('')
    const missingCharRef = useRef<HTMLSpanElement>(null)
    const [isAutoTyping, setIsAutoTyping] = useState(true)
    const autoTypingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const [autoTypingInterval, setAutoTypingInterval] = useState(200)

    const content = "Ich schreib jetzt langsam aber sehr bald werde ich der schnellste Rechtsanwalt Deutschlands sein... Probier's jetzt aus!"

    const contentBatches = useMemo(() => {
        const batches: ContentBatch[] = []
        const lines = content.split('\n')
        let currentBatch: ContentBatch | null = null

        lines.forEach((line) => {
            if (line.trim() === '') {
                if (currentBatch) {
                    currentBatch.content += '\n'
                    batches.push(currentBatch)
                    currentBatch = null
                } else {
                    batches.push({ type: 'p', content: '\n' })
                }
            } else {
                if (currentBatch) {
                    currentBatch.content += line + '\n'
                } else {
                    currentBatch = { type: 'p', content: line + '\n' }
                }
            }
        })

        if (currentBatch) batches.push(currentBatch)
        return batches
    }, [content])

    const autoTypeNextChar = useCallback(() => {
        const currentBatch = contentBatches[currentBatchIndex]
        const nextRequiredChar = currentBatch.content[typedText.length]

        if (nextRequiredChar === '\n') {
            setTypedText(prev => prev + '\n')
            setLastInput('↵')
        } else {
            setTypedText(prev => prev + nextRequiredChar)
            setLastInput(nextRequiredChar)
        }

        if (typedText.length + 1 === currentBatch.content.length) {
            if (currentBatchIndex < contentBatches.length - 1) {
                setCurrentBatchIndex(prevIndex => prevIndex + 1)
                setTypedText('')
            } else {
                setIsAutoTyping(false)
                if (autoTypingIntervalRef.current) {
                    clearTimeout(autoTypingIntervalRef.current)
                }
            }
        }

        // Update the interval
        setAutoTypingInterval(prevInterval => Math.max(prevInterval - 5, 10))
    }, [contentBatches, currentBatchIndex, typedText])

    useEffect(() => {
        if (isAutoTyping) {
            const typeNextChar = () => {
                autoTypeNextChar()
                if (isAutoTyping) {
                    autoTypingIntervalRef.current = setTimeout(typeNextChar, autoTypingInterval)
                }
            }
            autoTypingIntervalRef.current = setTimeout(typeNextChar, autoTypingInterval)
        } else {
            if (autoTypingIntervalRef.current) {
                clearTimeout(autoTypingIntervalRef.current)
            }
            // Reset interval when auto-typing stops
            setAutoTypingInterval(1000)
        }

        return () => {
            if (autoTypingIntervalRef.current) {
                clearTimeout(autoTypingIntervalRef.current)
            }
        }
    }, [isAutoTyping, autoTypeNextChar, autoTypingInterval])

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

        return <p key={index}>{content}</p>
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
                    <ScrollArea className="h-full pr-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            {contentBatches.map(renderBatch)}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
