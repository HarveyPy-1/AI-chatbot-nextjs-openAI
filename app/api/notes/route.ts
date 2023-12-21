// This is API route. You can also use Server actions for api as they are stable now, but they don't support streaming text like chatgpt does

import prisma from "@/lib/db/prisma";
import { createNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

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
