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

  return <div>{JSON.stringify(allNotes)}</div>;
};
export default NotesPage;
