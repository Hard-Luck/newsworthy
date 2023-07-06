export interface Article {
  id?: number;
  title: string;
  topic: string;
  author: string;
  body: string;
  created_at: number;
  votes?: number;
  article_img_url?: string;
}
export interface ArticleWithCommentCount {
  id?: number;
  title: string;
  topic: string;
  author: string;
  comment_count: number;
  created_at: number;
  votes?: number;
  article_img_url?: string;
}
export interface Comment {
  id?: number;
  body: string;
  votes: number;
  author: string;
  article_id?: number;
  created_at: number;
  created_by?: string;
  belongs_to?: string;
}

export interface Topic {
  id?: number;
  slug: string;
  description: string;
}

export interface User {
  id?: number;
  username: string;
  name: string;
  avatar_url: string;
  password: string;
}

export type CommentResponse = {
  comment_id: number;
  body: string;
  votes: number;
  author: string;
  article_id: number;
  created_at: number;
};
