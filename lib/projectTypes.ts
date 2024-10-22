export type UserProfile = {
    id: string;
    email: string;
    username?: string;
    photoURL?: string;
};

export type Document = {
    id: string;
    title: string;
    content: string;
};

export interface MarkdownFile {
    name: string;
    url: string;
    content: string;
}

