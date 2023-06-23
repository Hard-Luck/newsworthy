import articles from "./articles";
import comments from "./comments";
import topics from "./topics";
import users from "./users";

interface Article {
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

interface Topic {
  slug: string;
  description: string;
}

interface User {
  username: string;
  name: string;
  avatar_url: string;
}

export const articleData: Article[] = articles
export const commentData: Comment[] = comments
export const topicData: Topic[] = topics
export const userData: User[] = users;
