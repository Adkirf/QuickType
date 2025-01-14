'use server';

import fs from 'fs/promises';
import path from 'path';

import { MarkdownFile } from '@/lib/projectTypes';
import { getDownloadURL } from 'firebase/storage';
import { getMetadata } from 'firebase/storage';
import { storage } from './config';
import { listAll, ref } from 'firebase/storage';

export const getLocalFiles = async (): Promise<MarkdownFile[]> => {

    const dirPath = path.join(process.cwd(), "public", "assets", "papers");
    try {
        const files = await fs.readdir(dirPath);
        const markdownFiles: MarkdownFile[] = await Promise.all(files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            return {
                name: file,
                url: filePath,
                content: content,
            };
        }));
        return markdownFiles;
    } catch (error) {
        console.error('Error reading from Firebase Storage:', error);
        return [];
    }
};

export const getStorageFiles = async (): Promise<MarkdownFile[]> => {
    try {
        // Reference to the papers folder in Firebase Storage
        const storageRef = ref(storage, 'papers');

        // List all items in the papers folder
        const result = await listAll(storageRef);

        // Get file details for each item
        const markdownFiles = await Promise.all(
            result.items.map(async (item) => {
                // Get the download URL
                const url = await getDownloadURL(item);

                // Fetch the file content
                const response = await fetch(url);
                const content = await response.text();

                // Get metadata (optional)
                const metadata = await getMetadata(item);

                return {
                    name: item.name,
                    url: url,
                    content: content,
                    // Add any additional metadata you want to include
                    lastModified: metadata.timeCreated,
                };
            })
        );

        return markdownFiles;
    } catch (error) {
        console.error('Error reading from Firebase Storage:', error);
        return [];
    }
};

