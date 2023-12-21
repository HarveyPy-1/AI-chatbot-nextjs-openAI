import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openAI, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import {
  ChatCompletionMessage,
  ChatCompletionSystemMessageParam,
} from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse, streamToResponse } from "ai";

export async function POST(req: Request) {
  try {
    // message from the chat
    const body = await req.json();

    // type comes from openai, body.messages is coming from the vercel ai sdk. the form name is messages
    const messages: ChatCompletionMessage[] = body.messages;

    // truncating our texts to the last 6 messages to save tokens
    const messagesTruncated = messages.slice(-6);

    // creating a vector embedding that finds the relevant note that fits with the chat message
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    // get userId
    const { userId } = auth();

    // make request to pinecone to get notes with embeddings close to our chat history (meaning that the meaning is similar)
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4, // It'll find only four notes (vector) that rhymes with our request. This is ok for a small project and to save tokens
      filter: { userId },
    });

    // get relevant note from mongodb
    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          // creates an array of ids of results gotten from pinecone. "in" returns notes from mongodb that has id in the array
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes: ", relevantNotes);

    // create a system message to prime the chatbot
    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are: \n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    //make request to ChatGPT
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    //return to the frontend
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
