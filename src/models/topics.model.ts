import db from '../db/connection';

export async function getAllTopics() {
  const topics = await db.query(`SELECT * FROM topics;`);
  return topics.rows;
}

export async function insertTopic(topic: {
  slug: string;
  description: string;
}) {
  if (!topic.slug || !topic.description) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  if (Object.keys(topic).length > 2) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const { rows } = await db.query(
    `
  INSERT INTO topics (slug, description) 
  VALUES ($1, $2) 
  RETURNING *;`,
    [topic.slug, topic.description]
  );
  return rows[0];
}
