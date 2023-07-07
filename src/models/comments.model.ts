import db from '../db/connection';
import { articleExists } from './articles.model';

export async function getCommentsByArticleId(
  articleId: number,
  limit: string | number = '10',
  p: string | number = '1'
) {
  [limit, p] = [parseInt(limit as string), parseInt(p as string)];
  if (isNaN(articleId) || isNaN(limit) || isNaN(p) || limit < 1 || p < 1) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  if (!(await articleExists(articleId)))
    return Promise.reject({ status: 404, msg: 'Article not found' });
  const { rows } = await db.query(
    `
    SELECT * 
    FROM 
      comments 
    WHERE 
      article_id = $1 
    ORDER BY 
      created_at DESC 
    LIMIT $2 OFFSET $3;`,
    [articleId, limit, (p - 1) * limit]
  );
  return rows;
}

export async function addCommentByArticleId(
  articleId: number,
  username: string,
  body: string
) {
  if (!(await articleExists(articleId)))
    return Promise.reject({ status: 404, msg: 'Article not found' });
  const { rows } = await db.query(
    `
    INSERT INTO comments 
        (article_id, author, body) 
    VALUES 
        ($1, $2, $3) 
    RETURNING *;
    `,
    [articleId, username, body]
  );
  return rows[0];
}

export async function deleteCommentById(commentId: number, username: string) {
  const comment = await getComment(commentId);
  if (!comment)
    return Promise.reject({ status: 404, msg: 'Comment not found' });
  if (comment.author !== username)
    return Promise.reject({ status: 403, msg: 'Unauthorized' });
  return db.query(
    `
    DELETE FROM comments 
    WHERE 
        comment_id = $1 AND author = $2
    RETURNING *;
    `,
    [commentId, username]
  );
}

export async function updateCommentVotes(commentID: number, newVote: number) {
  const comment = await getComment(commentID);
  if (!comment) return Promise.reject({ status: 404, msg: 'Not found' });
  const { rows } = await db.query(
    `
        UPDATE comments 
        SET 
            votes = votes + $1 
        WHERE 
            comment_id = $2 
        RETURNING *;
        `,
    [newVote, commentID]
  );
  return rows[0];
}

async function getComment(commentId: number) {
  const { rows } = await db.query(
    `
    SELECT * 
    FROM 
        comments 
    WHERE 
        comment_id = $1
    `,
    [commentId]
  );
  return rows[0];
}
