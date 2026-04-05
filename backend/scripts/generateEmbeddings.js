import fs from "fs";
import { getEmbedding } from "../rag/embed.js";

const data = JSON.parse(fs.readFileSync("./data/knowledge.json", "utf-8"));

async function run() {
  const newData = [];

  for (let item of data) {
    console.log("Embedding:", item.category);

    const embedding = await getEmbedding(item.content);

    newData.push({
      ...item,
      embedding,
    });
  }

  fs.writeFileSync(
    "./data/knowledge_with_embeddings.json",
    JSON.stringify(newData, null, 2),
  );

  console.log("✅ Embeddings saved!");
}

run();
