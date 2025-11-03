import { MongoClient } from "mongodb";
import fs from "fs";

const uri = "mongodb://localhost:27017/biocrats";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("alumniDB");
    const collection = database.collection("users");

    const data = JSON.parse(fs.readFileSync("alumni_data.json", "utf8"));
    const result = await collection.insertMany(data);

    console.log(`${result.insertedCount} alumni records inserted successfully`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
