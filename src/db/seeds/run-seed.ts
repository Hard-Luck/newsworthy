import devData from "../data/development-data/";
import seed from "./seed";
import db from "../connection";



async function runSeed(): Promise<void> {
  try {
    await seed(devData)
    console.log("🌱 Seeding successful 🌱");
  } catch (error) {
    console.log(error);
  } finally {
    return db.end();
  }
};

runSeed();
