import format from 'pg-format';
import db from '../connection';
import { convertTimestampToDate, createRef, formatComments } from './utils';
import type { Article, Comment, Topic, User } from '../../types/api';

interface SeedData {
  topicData: Topic[];
  userData: User[];
  articleData: Article[];
  commentData: Comment[];
}

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData
}: SeedData): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR
    );
  `);

  await db.query(`
    CREATE TABLE users (
      username  VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR,
      password VARCHAR
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR NOT NULL REFERENCES topics(slug),
      author VARCHAR NOT NULL REFERENCES users(username),
      body VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INT DEFAULT 0 NOT NULL,
      article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    );
  `);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT NOT NULL,
    author VARCHAR NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES users(username)
  );
`);


  const insertTopicsQueryStr = format(
    'INSERT INTO topics (slug, description) VALUES %L;',
    topicData.map(({ slug, description }) => [slug, description])
  );
  const topicsPromise = db.query(insertTopicsQueryStr);

  const insertUsersQueryStr = format(
    'INSERT INTO users ( username, name, avatar_url, password) VALUES %L;',
    userData.map(({ username, name, avatar_url, password }) => [
      username,
      name,
      avatar_url,
      password
    ])
  );
  const usersPromise = db.query(insertUsersQueryStr);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
    formattedArticleData.map(
      (article: {
        title: string;
        topic: string;
        author: string;
        body: string;
        created_at: Date;
        votes: number;
        article_img_url: string;
      }) => [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes || 0,
          article.article_img_url
        ]
    )
  );

  const { rows: articleRows } = await db.query(insertArticlesQueryStr);

  const articleIdLookup = createRef(articleRows, 'title', 'article_id');
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at
      ]
    )
  );
  await db.query(insertCommentsQueryStr);
};

export default seed;
