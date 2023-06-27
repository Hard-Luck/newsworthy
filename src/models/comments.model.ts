import db from "../db/connection";
import { articleExists } from "./articles.model";
export async function getCommentsByArticleId(articleId: number) {
    if (!await articleExists(articleId)) return Promise.reject({ status: 404, msg: "Article not found" })
    const { rows } = await db.query(`SELECT * FROM comments WHERE article_id = $1;`, [articleId])
    console.log(rows);

    return rows;
}
