import app from "../app";
import request from "supertest";
import { isTopic } from "../utils/typeguards";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import db from "../db/connection";



beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("/api/topics", () => {
  it("200: Should respond with an array of topics with slug and description", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics.length).toBe(3);
    body.topics.forEach((topic: unknown) => {
      if (isTopic(topic)) {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("description");
      } else {
        throw new Error("Topic is not of type Topic");
      }
    });
  });
});
