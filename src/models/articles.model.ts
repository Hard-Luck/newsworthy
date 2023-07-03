import db from "../db/connection";


export async function getAllArticles() {
    const { rows } = await db.query(`
    SELECT 
        a.author,
        a.title,
        a.article_id,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id) AS comment_count
    FROM 
        articles a
    LEFT JOIN 
        comments c 
    ON 
        c.article_id = a.article_id
    GROUP BY 
        a.article_id
    ORDER BY
        a.created_at DESC
    `)
    return rows
}
export async function getArticleById(id: number) {
    const { rows, rowCount } = await db.query(
        `SELECT * FROM articles WHERE article_id = $1`, [id]
    )
    if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }

    return rows[0]
}

export async function articleExists(id: number) {
    const { rowCount } = await db.query(
        `SELECT * FROM articles WHERE article_id = $1 `, [id]
    )

    return rowCount === 1
}

export async function updateArticleVotes(id: number, votes: number) {
    const { rowCount, rows } = await db.query(
        `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [votes, id]
    )
    if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
}