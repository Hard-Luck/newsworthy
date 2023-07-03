import app from "../app";
import request from "supertest";
import { isArticle, isArticleWithCommentCount, isComment, isTopic } from "../utils/typeguards";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import db from "../db/connection"
import endpoints from "../endpoints.json"
import { isSorted } from "../utils/sorted";
import { CommentResponse } from "../types/api";

let jwt: string;
beforeAll(async () => {
  try {
    const { body } = await request(app)
      .post("/login")
      .send({ username: "butter_bridge", password: "butter_bridge" });
    jwt = body.token;
  } catch (error) {
    console.error("Error in beforeAll: ", error);
  }
});
beforeEach(() => seed(testData))

afterAll(() => db.end())

describe('/api', () => {
  describe('GET', () => {
    it('200: Should respond with a json object with endpoints', async () => {
      const { body } = await request(app)
        .get('/api')
        .expect(200)
      expect(body).toEqual(endpoints)
    }
    )
  })
});
describe("/api/topics", () => {
  describe('GET', () => {
    it("200: Should respond with an array of topics with slug and description", async () => {
      const { body } = await request(app)
        .get("/api/topics")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.topics.length).toBe(3);
      body.topics.forEach((topic: unknown) => {
        expect(isTopic(topic)).toBe(true);
      });
    });
    it("403: Should respond with error if user is not logged in", async () => {
      await request(app)
        .get("/api/topics")
        .expect(403);

    })
  });
});
describe('/api/articles', () => {
  describe('GET', () => {
    it("200: Should respond with an array of articles, each with required properties", async () => {
      const { body } = await request(app)
        .get("/api/articles")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article: unknown) => {
        expect(isArticleWithCommentCount(article)).toBe(true);
        expect(article).not.toHaveProperty('body');
      });
      let sorted = true;
      for (let i = 1; i < body.articles.length; i++) {
        if (body.articles[i - 1].created_at < body.articles[i].created_at) {
          sorted = false;
          break;
        }
      }
      expect(sorted).toBe(true);
    });
    it("403: Should respond with error if user is not logged in", async () => {
      await request(app)
        .get("/api/articles")
        .expect(403);
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe('GET', () => {
    it("200: Should respond with an article object with required properties", async () => {
      const articleId = 1; // Assume you have an article with ID 1 in your database
      const { body } = await request(app)
        .get(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(isArticle(body.article)).toBe(true);
    });

    it("400: Should respond with error if invalid article id type is provided", async () => {
      const invalidArticleId = "invalid";
      const { body } = await request(app)
        .get(`/api/articles/${invalidArticleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
      expect(body.msg).toBe('Bad request');
    });
    it("403: Should respond with error if user is not logged in", async () => {
      const articleId = 1;
      await request(app)
        .get(`/api/articles/${articleId}`)
        .expect(403);
    });
    it("404: Should respond with error if article id is not found", async () => {
      const articleId = 9999;
      const { body } = await request(app)
        .get(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
      expect(body.msg).toBe('Article not found');
    });
  });
  describe("PATCH", () => {
    it("200: Responds with the updated article when a valid vote increment is provided", async () => {
      const articleId = 1;
      const voteIncrement = { inc_votes: 1 };

      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(isArticle(body.article)).toBe(true);
      expect(body.article.votes).toBe(1);
    });
    it("200: Responds with the updated article when a valid positive vote increment greater than one is provided", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: 10 };

      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(body.article.votes).toBe(10);
    });

    it("200: Responds with the updated article when a valid negative vote increment is provided", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: -5 };

      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(body.article.votes).toBe(-5);
    });
    it("400: Responds with error when an invalid vote increment is provided", async () => {
      const articleId = 1;
      const voteIncrement = { inc_votes: "invalid" };

      await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    it("400: Responds with error when an invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      const voteIncrement = { inc_votes: 1 };

      await request(app)
        .patch(`/api/articles/${invalidArticleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    it("403: Responds with error when the user is not logged in", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: 1 };
      await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .expect(403);
    });
    it("404: Responds with error when the article ID does not exist", async () => {
      const nonExistentArticleId = 9999;
      const voteIncrement = { inc_votes: 1 };
      await request(app)
        .patch(`/api/articles/${nonExistentArticleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
    });
  });

});
describe("/api/articles/:article_id/comments", () => {
  describe('GET', () => {
    it("200: Should respond with an empty array of comments for a valid article ID with no comments", async () => {
      const articleId = 2;
      const { body } = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(Array.isArray(body.comments)).toBe(true);
      expect(body.comments.length).toBe(0);
    });
    it("200: Should respond with an array of comments for a valid article ID", async () => {
      const articleId = 1; // Use the ID of an article that has comments
      const { body } = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(Array.isArray(body.comments)).toBe(true);
      body.comments.forEach((comment: unknown) => {
        expect(isComment(comment)).toBe(true);
      });
      expect(isSorted<CommentResponse>(body.comments, "created_at")).toBe(true)
    });
    it("400: Should respond with error if invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      await request(app)
        .get(`/api/articles/${invalidArticleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    it("403: Should respond with error if user is not logged in", async () => {
      const articleId = 1;
      await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(403);
    });
    it("404: Should respond with error if article ID is not found", async () => {
      const nonExistentArticleId = 9999;
      await request(app)
        .get(`/api/articles/${nonExistentArticleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
    });
  });
  describe("POST", () => {
    it("201: Responds with the posted comment when a valid article ID and comment body are provided", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const commentBody = { body: "This is a new comment!" };

      const { body } = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(201);

      expect(isComment(body.comment)).toBe(true);
    });

    it("400: Responds with error when an invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      const commentBody = { body: "This is a new comment!" };

      await request(app)
        .post(`/api/articles/${invalidArticleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });

    it("400: Responds with error when the request body does not contain a 'body' property", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const commentBody = { notBody: "This is a new comment!" };

      await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });

    it("403: Responds with error when the user is not logged in", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const commentBody = { body: "This is a new comment!" };

      await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .expect(403);
    });

    it("404: Responds with error when the article ID does not exist", async () => {
      const nonExistentArticleId = 9999;
      const commentBody = { body: "This is a new comment!" };

      await request(app)
        .post(`/api/articles/${nonExistentArticleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
    });
  });

});
