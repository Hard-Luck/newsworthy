import db from '../db/connection';

export async function getAllTopics() {
  const topics = await db.query(`SELECT * FROM topics;`);
  return topics.rows;
}
