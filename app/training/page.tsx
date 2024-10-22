'use client';

import { useEffect, useState } from 'react';
import { getLocalFiles } from '@/lib/firebase/storage';
import { MarkdownFile } from '@/lib/projectTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MarkdownViewer from '@/components/MarkdownViewer';

export default function TrainingPage() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
  const [containerHeight, setContainerHeight] = useState('80vh');

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - (windowHeight * 0.2); // Subtract 20vh
      setContainerHeight(`${newHeight}px`);
    };

    // Set initial height
    updateContainerHeight();

    // Add event listener for window resize
    window.addEventListener('resize', updateContainerHeight);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  useEffect(() => {
    async function loadFiles() {
      try {
        const loadedFiles = await getLocalFiles();
        setFiles(loadedFiles);
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col" style={{ height: containerHeight }}>
      <h1 className="text-2xl font-bold mb-4">Training Materials</h1>
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="col-span-1 overflow-y-auto">
            <Card className="h-full">
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
          <div className="col-span-1 md:col-span-2 h-full overflow-hidden">
            {selectedFile ? (
              <MarkdownViewer content={selectedFile.content} />
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-center">Select a document to view its content.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
