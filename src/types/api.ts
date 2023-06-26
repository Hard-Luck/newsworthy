export interface Article {
    title: string;
    topic: string;
    author: string;
    body: string;
    created_at: number;
    votes?: number;
    article_img_url?: string;
}

export interface Comment {
    body: string;
    votes: number;
    author: string;
    article_id?: number;
    created_at: number;
    created_by?: string;
    belongs_to?: string
}

export interface Topic {
    slug: string;
    description: string;
}

export interface User {
    username: string;
    name: string;
    avatar_url: string;
}