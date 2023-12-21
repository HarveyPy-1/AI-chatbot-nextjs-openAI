import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) throw Error("OPENAI_API_KEY is missing!");

const openAI = new OpenAI({ apiKey });

export default openAI;

export async function getEmbedding(text: string) {
  const response = await openAI.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw Error("Error generating embedding!");

  console.log(embedding);

  return embedding;
}
