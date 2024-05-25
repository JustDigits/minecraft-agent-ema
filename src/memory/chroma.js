import { ChromaClient } from "chromadb";

const client = new ChromaClient();

// await client.reset();
await client.heartbeat();

const collection = await client.getOrCreateCollection({
  name: "test",
});

await collection.upsert({
  documents: [
    "This is a document about pineapple",
    "This is a document about oranges",
    "Minecraft is a videogame",
  ],
  ids: ["id1", "id2", "id3"],
});

const results = await collection.query({
  queryTexts: ["This is a query document about pineapples"], // Chroma will embed this for you
  nResults: 3, // how many results to return
});

console.log(results);
