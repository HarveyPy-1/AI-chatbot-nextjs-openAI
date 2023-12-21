import Note from "@/components/ui/note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

// Notice the folder where this page is contained, it has a layout.tsx, this enables the NavBar to only render on /notes or other links under /notes/other-links. You can do this for other components as well

// Page title and description
export const metadata: Metadata = {
  title: "AI Notes | Notes",
};

const NotesPage = async () => {
  // Get userId
  const { userId } = auth();

  // To be able to access this page, you are already logged in. If for some reason you aren't, throw an error immediately. Also you need to do the below for typescript sake
  if (!userId) throw Error("userId undefined");

  // Get notes from db with the same ID
  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full mt-10 text-center text-gray-400">
          {
            "It looks empty in here. Why don't you create a note? Looking for inspiration? Ask AI"
          }
        </div>
      )}
    </div>
  );
};
export default NotesPage;
