import db from "../db/connection";

export async function getArticleById(id: number) {
    const { rows, rowCount } = await db.query(
        `SELECT * FROM articles WHERE article_id = $1`, [id]
    )
    if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }

    return rows[0]
}
