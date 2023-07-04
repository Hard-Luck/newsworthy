import db from "../db/connection";


export async function getAllArticles({ sort_by, order, topic }: { sort_by?: string, order?: string, topic?: string }) {
    sort_by ??= "created_at"
    order ??= "desc"
    const queryParams = []
    const validSortBy = ["created_at", "title", "topic", "author", "votes"]
    const validOrder = ["asc", "desc"]
    if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad request" })
    }
    let query = `
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
    `
    if (topic) {
        query += ` WHERE a.topic = $1 `
        queryParams.push(topic)
    }
    query += `
    GROUP BY 
        a.article_id
    ORDER BY
        a.${sort_by} ${order}
        `

    const { rows } = await db.query(query, queryParams)
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