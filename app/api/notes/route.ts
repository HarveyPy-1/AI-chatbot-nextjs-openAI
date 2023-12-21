// This is API route. You can also use Server actions for api as they are stable now, but they don't support streaming text like chatgpt does

import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

// POST ENDPOINT
export async function POST(req: Request) {
  try {
    // Data to be sent to the endpoint (The notes)
    const body = await req.json();

    // Validating (Check lib folder)
    // We also use .safeParse() because we want to use our own customized error message
    const parseResult = createNoteSchema.safeParse(body);

    // If not successful
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // If successful
    const { title, content } = parseResult.data;

    // Get userId for new notes
    const { userId } = auth();

    // If no userId
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // create embedding for the note
    const embedding = await getEmbeddingForNote(title, content);

    // transactions are used to create mutable db operations which are only applied if all operation succeed. if any fails, they'll be rolled back. We do this because, if mongodb fails, we do not want to create it's pinecone vector and vice versa
    const note = await prisma.$transaction(async (tx) => {
      // Send note to mongodb first because we can't rollback pinecone operation
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      // send to pinecone index(db) if mongodb transaction is successful
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT ENDPOINT
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);

    // If not successful
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // If successful
    const { id, title, content } = parseResult.data;

    // Get id of the note you want to update
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found!" }, { status: 401 });
    }

    // Get userId for new notes
    const { userId } = auth();

    // If no userId and if userId does not match, so not every user can edit every post
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create embedding for openAI
    const embedding = await getEmbeddingForNote(title, content);

    // start db transaction
    const updatedNote = await prisma.$transaction(async (tx) => {
      // create and add updated note to db and start transaction
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      // add vector to pinecone index (db) if mongodb transaction is successful
      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE ENDPOINT
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    // If not successful
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // If successful
    const { id } = parseResult.data;

    // Get id of the note you want ot update
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found!" }, { status: 401 });
    }

    // Get userId for new notes
    const { userId } = auth();

    // If no userId
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      // delete note from mongodb
      await prisma.note.delete({ where: { id } });

      // delete note from pinecone if mongodb delete transaction is successful
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Send every note to be embedded (turned into vectors) by openAI
async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
