import { Article, Topic } from "../types/api";

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