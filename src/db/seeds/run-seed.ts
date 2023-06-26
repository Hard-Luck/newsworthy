import devData from "../data/development-data/";
import seed from "./seed.js";
import db from "../connection.js";

const runSeed = (): Promise<void> => {
  return seed(devData).then(() => db.end());
};

runSeed();
