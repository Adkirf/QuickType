'use server';

import fs from 'fs/promises';
import path from 'path';

import { MarkdownFile } from '@/lib/projectTypes';

export const getLocalFiles = async (): Promise<MarkdownFile[]> => {
    const dirPath = path.join(process.cwd(), 'assets', 'papers');
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
        console.error('Error reading local directory:', error);
        return [];
    }
};