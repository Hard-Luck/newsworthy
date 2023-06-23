import { articleData, commentData, topicData, userData } from "../data/development-data/";
import seed from "./seed.js";
import db from "../connection.js";

const runSeed = (): Promise<void> => {
  return seed({ articleData, commentData, topicData, userData }).then(() => db.end());
};

runSeed();
