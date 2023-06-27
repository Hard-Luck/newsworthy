import { Article, ArticleWithCommentCount, CommentResponse, Topic } from "../types/api";

export function isTopic(value: unknown): value is Topic {
    return (
        typeof value === "object" &&
        value !== null &&
        "slug" in value &&
        "description" in value
    );
}


export function isArticle(value: unknown): value is Article {
    return (
        typeof value === "object" &&
        value !== null &&
        "author" in value &&
        "title" in value &&
        "article_id" in value &&
        "body" in value &&
        "topic" in value &&
        "created_at" in value &&
        "votes" in value &&
        "article_img_url" in value
    );
}
export function isArticleWithCommentCount(value: unknown): value is ArticleWithCommentCount {
    return (
        typeof value === "object" &&
        value !== null &&
        "author" in value &&
        "title" in value &&
        "article_id" in value &&
        "comment_count" in value &&
        "topic" in value &&
        "created_at" in value &&
        "votes" in value &&
        "article_img_url" in value
    );
}

export function isComment(value: unknown): value is CommentResponse {
    console.log(value);
    return (
        typeof value === "object" &&
        value !== null &&
        "author" in value &&
        "body" in value &&
        "comment_id" in value &&
        "votes" in value &&
        "article_id" in value &&
        "created_at" in value

    )
}