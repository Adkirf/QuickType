export type UserProfile = {
    id: string;
    email: string;
    username?: string;
    photoURL?: string;
};



export interface MarkdownFile {
    name: string;
    url: string;
    content: string;
}

