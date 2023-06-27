import app from "../app";
import request from "supertest";
import { isArticle, isTopic } from "../utils/typeguards";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import db from "../db/connection"
import endpoints from "../endpoints.json"


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

describe("/api/topics", () => {
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
describe('GET /api', () => {
  it('200: Should respond with a json object with endpoints', async () => {
    const { body } = await request(app)
      .get('/api')
      .expect(200)
    expect(body).toEqual(endpoints)
  }
  )
})
describe("/api/articles/:article_id", () => {
  it("200: Should respond with an article object with required properties", async () => {
    const articleId = 1; // Assume you have an article with ID 1 in your database
    const { body } = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);

    expect(isArticle(body.article)).toBe(true);
  });

  it("404: Should respond with error if article id is not found", async () => {
    const articleId = 9999;
    const { body } = await request(app)
      .get(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(404);

    expect(body.msg).toBe('Article not found');
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
});
