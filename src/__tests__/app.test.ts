import app from "../app";
import request from "supertest";
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
      .post("/api/login")
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
    test('200: Should respond with a json object with endpoints', async () => {
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
    test("Status 200: Should respond with an array of topics with slug and description", async () => {
      const { body } = await request(app)
        .get("/api/topics")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.topics.length).toBe(3);
      body.topics.forEach((topic: unknown) => {
        expect(topic).toHaveProperty('slug');
        expect(topic).toHaveProperty('description');
      });
    });
    test("Status 403: Should respond with error if user is not logged in", async () => {
      await request(app)
        .get("/api/topics")
        .expect(403);
    })
  });
});
describe('/api/articles', () => {
  describe('GET', () => {
    test("Status 200: Should respond with an array of articles, each with required properties sorted by created_at", async () => {
      const { body } = await request(app)
        .get("/api/articles")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article: unknown) => {
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
        expect(article).toHaveProperty('comment_count');
        expect(article).not.toHaveProperty('body');
      });
      isSorted(body.articles, 'created_at', true);
    });
    test("Status 200: Should respond with articles sorted by votes in ascending order when sort_by=votes and order=asc is provided", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(isSorted(body.articles, "votes", false)).toBe(true);
    });
    test("Status 200: Should respond with articles filtered by topic when topic query is provided", async () => {
      const topic = "mitch"; // Replace with an actual topic from your database
      const { body } = await request(app)
        .get(`/api/articles?topic=${topic}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      body.articles.forEach((article: any) => {
        expect(article.topic).toEqual(topic);
      });
    });
    test("Status 400: Should respond with error when invalid sort_by is provided", async () => {
      await request(app)
        .get("/api/articles?sort_by=invalid")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 400: Should respond with error when invalid order is provided", async () => {
      await request(app)
        .get("/api/articles?order=invalid")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 403: Should respond with error if user is not logged in", async () => {
      await request(app)
        .get("/api/articles")
        .expect(403);
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe('GET', () => {
    test("Status 200: Should respond with an article object with required properties", async () => {
      const articleId = 1; // Assume you have an article with ID 1 in your database
      const { body } = await request(app)
        .get(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.article).toHaveProperty("author");
      expect(body.article).toHaveProperty("title");
      expect(body.article).toHaveProperty("article_id");
      expect(body.article).toHaveProperty("body");
      expect(body.article).toHaveProperty("topic");
      expect(body.article).toHaveProperty("created_at");
      expect(body.article).toHaveProperty("votes");
      expect(body.article).toHaveProperty("article_img_url");
    });
    test("Status 400: Should respond with error if invalid article id type is provided", async () => {
      const invalidArticleId = "invalid";
      const { body } = await request(app)
        .get(`/api/articles/${invalidArticleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
      expect(body.msg).toBe('Bad request');
    });
    test("Status 403: Should respond with error if user is not logged in", async () => {
      const articleId = 1;
      await request(app)
        .get(`/api/articles/${articleId}`)
        .expect(403);
    });
    test("Status 404: Should respond with error if article id is not found", async () => {
      const articleId = 9999;
      const { body } = await request(app)
        .get(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
      expect(body.msg).toBe('Article not found');
    });
    test("Should have additional property of comment count", async () => {
      const articleId = 1
      const { body } = await request(app)
        .get(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.article).toHaveProperty("comment_count", 11);
    })
  });
  describe("PATCH", () => {
    test("Status 200: Responds with the updated article when a valid vote increment is provided", async () => {
      const articleId = 1;
      const voteIncrement = { inc_votes: 1 };
      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.article.votes).toBe(1);
    });
    test("Status 200: Responds with the updated article when a valid positive vote increment greater than one is provided", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: 10 };
      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.article.votes).toBe(10);
    });
    test("Status 200: Responds with the updated article when a valid negative vote increment is provided", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: -5 };
      const { body } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.article.votes).toBe(-5);
    });
    test("Status 400: Responds with error when an invalid vote increment is provided", async () => {
      const articleId = 1;
      const voteIncrement = { inc_votes: "invalid" };
      await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 400: Responds with error when an invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      const voteIncrement = { inc_votes: 1 };
      await request(app)
        .patch(`/api/articles/${invalidArticleId}`)
        .send(voteIncrement)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 403: Responds with error when the user is not logged in", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const voteIncrement = { inc_votes: 1 };
      await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(voteIncrement)
        .expect(403);
    });
    test("Status 404: Responds with error when the article ID does not exist", async () => {
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
    test("Status 200: Should respond with an empty array of comments for a valid article ID with no comments", async () => {
      const articleId = 2;
      const { body } = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(Array.isArray(body.comments)).toBe(true);
      expect(body.comments.length).toBe(0);
    });
    test("Status 200: Should respond with an array of comments for a valid article ID", async () => {
      const articleId = 1; // Use the ID of an article that has comments
      const { body } = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(Array.isArray(body.comments)).toBe(true);
      expect(body.comments.length).toBe(11);
      body.comments.forEach((comment: unknown) => {
        expect(comment).toHaveProperty('comment_id');
        expect(comment).toHaveProperty('votes');
        expect(comment).toHaveProperty('created_at');
        expect(comment).toHaveProperty('author');
        expect(comment).toHaveProperty('body');
        expect(comment).toHaveProperty('article_id');
      });
      expect(isSorted<CommentResponse>(body.comments, "created_at")).toBe(true)
    });
    test("Status 400: Should respond with error if invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      await request(app)
        .get(`/api/articles/${invalidArticleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 403: Should respond with error if user is not logged in", async () => {
      const articleId = 1;
      await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(403);
    });
    test("Status 404: Should respond with error if article ID is not found", async () => {
      const nonExistentArticleId = 9999;
      await request(app)
        .get(`/api/articles/${nonExistentArticleId}/comments`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
    });
  });
  describe("POST", () => {
    test("Status 201: Responds with the posted comment when a valid article ID and comment body are provided", async () => {
      const articleId = 1;
      const commentBody = { body: "This is a new comment!" };
      const { body } = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(201);
      const { comment } = body
      expect(comment).toHaveProperty('comment_id');
      expect(comment).toHaveProperty('votes');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('author');
      expect(comment).toHaveProperty('body');
      expect(comment).toHaveProperty('article_id');
    });
    test("Status 400: Responds with error when an invalid article ID type is provided", async () => {
      const invalidArticleId = "invalid";
      const commentBody = { body: "This is a new comment!" };
      await request(app)
        .post(`/api/articles/${invalidArticleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 400: Responds with error when the request body does not contain a 'body' property", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const commentBody = { notBody: "This is a new comment!" };
      await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 403: Responds with error when the user is not logged in", async () => {
      const articleId = 1; // Use the ID of an article that exists in the database
      const commentBody = { body: "This is a new comment!" };
      await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(commentBody)
        .expect(403);
    });
    test("Status 404: Responds with error when the article ID does not exist", async () => {
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
describe("/api/comments/:comment_id", () => {
  describe('PATCH', () => {
    test('Status:200, returns the updated comment for a valid comment_id and request body', async () => {
      const { body } = await request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.comment).toHaveProperty('comment_id', 1);
      expect(body.comment).toHaveProperty('votes');
      expect(typeof body.comment.votes).toBe('number');
    });
    test('Status:200, increments the votes by any positive number', async () => {
      const { body } = await request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 10 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.comment).toHaveProperty('comment_id', 1);
      expect(body.comment.votes).toBeGreaterThan(10); // Modify as per your initial votes count
    });
    test('Status:200, decrements the votes by any negative number', async () => {
      const { body } = await request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -10 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.comment).toHaveProperty('comment_id', 1);
      expect(body.comment.votes).toBe(6); // Modify as per your initial votes count
    });
    test('Status:400, for a request body with incorrect keys', async () => {
      const { body } = await request(app)
        .patch('/api/comments/1')
        .send({ incorrect_key: 1 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
      expect(body.msg).toBe('Bad request');
    });
    test('Status:400, for an invalid comment_id', async () => {
      const { body } = await request(app)
        .patch('/api/comments/not-a-number')
        .send({ inc_votes: 1 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
      expect(body.msg).toBe('Bad request');
    });
    test('Status:404, for a non-existent comment_id', async () => {
      const { body } = await request(app)
        .patch('/api/comments/99999')
        .send({ inc_votes: 1 })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
      expect(body.msg).toBe('Not found');
    });
    test('Status:403, for an unauthorized request', async () => {
      const { body } = await request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(403);
      expect(body.msg).toBe('No token provided');
    });
  });
  describe("DELETE", () => {
    test("Status 204: Responds with no content when a valid comment ID is provided and comment is deleted", async () => {
      const commentIdUserOwns = 1;
      await request(app)
        .delete(`/api/comments/${commentIdUserOwns}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204);
    });
    test("Status 400: Responds with error when an invalid comment ID type is provided", async () => {
      const invalidCommentId = "invalid";
      await request(app)
        .delete(`/api/comments/${invalidCommentId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(400);
    });
    test("Status 403: Responds with error when the user is not logged in", async () => {
      const commentId = 1;
      await request(app)
        .delete(`/api/comments/${commentId}`)
        .expect(403);
    });
    test("Status 403: Responds with error when the comment does not belong to the user", async () => {
      const commentIdNotBelongToUser = 3;
      await request(app)
        .delete(`/api/comments/${commentIdNotBelongToUser}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);
    });
    test("Status 404: Responds with error when the comment ID does not exist", async () => {
      const nonExistentCommentId = 9999;
      await request(app)
        .delete(`/api/comments/${nonExistentCommentId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
    });
  });
})
describe("/api/users", () => {
  describe('GET', () => {
    test("Status 200: Should respond with an array of users, each with username, name and avatar_url", async () => {
      const { body } = await request(app)
        .get("/api/users")
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(Array.isArray(body.users)).toBe(true);
      body.users.forEach((user: any) => {
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('avatar_url');
      });
    });
    test("Status 403: Should respond with error if user is not logged in", async () => {
      await request(app)
        .get("/api/users")
        .expect(403);
    });
  });
});
describe("/api/users/:username", () => {
  describe('GET', () => {
    test("Status 200: Should respond with a user object with correct properties", async () => {
      const username = "butter_bridge";
      const { body } = await request(app)
        .get(`/api/users/${username}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(body.user).toHaveProperty("username", "butter_bridge");
      expect(body.user).toHaveProperty("name", "jonny");
      expect(body.user).toHaveProperty("avatar_url", "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg");
    });
    test("Status 403: Should respond with an error if the user is not authenticated", async () => {
      const username = "butter_bridge";
      const { body } = await request(app)
        .get(`/api/users/${username}`)
        .expect(403); // Expect a 403 status code for unauthenticated requests
      expect(body.msg).toEqual('No token provided');
    });
    test("Status 404: Should respond with an error if the username is not found", async () => {
      const nonExistingUsername = "non_existing_username"; // Insert a username that does not exist in your database
      const { body } = await request(app)
        .get(`/api/users/${nonExistingUsername}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404);
      expect(body.msg).toEqual('Not found');
    });
  });
});