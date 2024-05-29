import { ChromaClient } from "chromadb";

import { COMMAND_DOCUMENTS } from "../commands/library.js";

const client = new ChromaClient();
const collectionName = "command_documentation";

export class ChromaDB {
  async loadDocuments() {
    await client.heartbeat();

    const collection = await client.getOrCreateCollection({
      name: collectionName,
    });

    await collection.upsert(COMMAND_DOCUMENTS);
  }

  async getRelevantDocuments(message) {
    const collection = await client.getOrCreateCollection({
      name: collectionName,
    });

    const results = await collection.query({
      queryTexts: [message], // Chroma will embed this for you
      nResults: 3, // how many results to return
    });

    return {
      ids: results.ids.flat(),
      distances: results.distances.flat(),
      documents: results.documents.flat(),
    };
  }

  async reset() {
    await client.heartbeat();
    await client.reset();
  }
}
