import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .process(markdown);

  return result.toString();
}

