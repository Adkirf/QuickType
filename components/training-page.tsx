'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { MarkdownFile } from '@/lib/projectTypes'
import { markdownToHtml } from '@/lib/utils'

export interface MarkdownDisplayProps {
    file: MarkdownFile;
}

export function MarkdownDisplay({ file }: MarkdownDisplayProps) {
    const [content, setContent] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function processMarkdown() {
            try {
                const html = await markdownToHtml(file.content)
                setContent(html)
            } catch (error) {
                console.error('Error processing markdown:', error)
            } finally {
                setLoading(false)
            }
        }

        processMarkdown()
    }, [file.content])

    if (loading) {
        return <div className="text-center">Loading...</div>
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{file.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
        </Card>
    )
}

export function TrainingPageComponent({ files }: { files: MarkdownFile[] }) {
    const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Training Materials</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.map((file) => (
                                <Button
                                    key={file.name}
                                    onClick={() => setSelectedFile(file)}
                                    className="w-full mb-2"
                                    variant="outline"
                                >
                                    {file.name}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-1 md:col-span-2">
                    {selectedFile ? (
                        <MarkdownDisplay file={selectedFile} />
                    ) : (
                        <Card>
                            <CardContent>
                                <p className="text-center">Select a document to view its content.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
