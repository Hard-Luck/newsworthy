import db from "../db/connection";
import { articleExists } from "./articles.model";
export async function getCommentsByArticleId(articleId: number) {
    if (!await articleExists(articleId)) return Promise.reject({ status: 404, msg: "Article not found" })
    const { rows } = await db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [articleId])
    return rows;
}

export async function addCommentByArticleId(articleId: number, username: string, body: string) {
    if (!await articleExists(articleId)) return Promise.reject({ status: 404, msg: "Article not found" })
    const { rows } = await db.query(`
    INSERT INTO comments 
        (article_id, author, body) 
    VALUES 
        ($1, $2, $3) 
    RETURNING *;
    `, [articleId, username, body])
    return rows[0];
}