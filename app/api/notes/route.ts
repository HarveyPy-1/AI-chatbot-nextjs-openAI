// This is API route. You can also use Server actions for api as they are stable now, but they don't support streaming text like chatgpt does

import prisma from "@/lib/db/prisma";
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

    // Send note to db after all checks passed
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
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

    // create and add updated note to db
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
      },
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

    // delete note from db
    await prisma.note.delete({ where: { id } });

    return Response.json({ message: "Note deleted!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
