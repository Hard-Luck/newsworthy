import app from "../app";
import request from "supertest";
import { isTopic } from "../utils/typeguards";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import db from "../db/connection"

let jwt: string;

beforeAll(async () => {
  try {
    const { body } = await request(app)
      .post("/login")
      .send({ username: "butter_bridge", password: "butter_bridge" });
    jwt = body.token;
    await seed(testData);
  } catch (error) {
    console.error("Error in beforeAll: ", error);
  }
});

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
});
