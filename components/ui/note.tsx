"use client";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { remark } from 'remark';
import html from 'remark-html';
import { Separator } from "./separator";
import { useState } from "react";
import ModifyNoteDialog from "./modifyNoteDialog";

interface NoteProps {
  note: NoteModel;
}

async function toHtml(content:string){
  const processedContent = await remark()
  .use(html)
  .process(content);
  return processedContent.toString();
}

const Note = ({ note }: NoteProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // check if note was updated
  const wasUpdated = note.updatedAt > note.createdAt;

  // make timestamp human-readable
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  

  return (
    <>
      <Card
        onClick={() => setShowEditDialog(true)}
        className="cursor-pointer shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " · updated"}
          </CardDescription>
        </CardHeader>
        <Separator className="mb-2 -mt-4" />
        <CardContent>
          <div  className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: toHtml(note.content || "") }} />
        </CardContent>
      </Card>
      <ModifyNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
};
export default Note;
