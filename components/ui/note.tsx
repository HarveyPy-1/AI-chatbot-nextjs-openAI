import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";

interface NoteProps {
  note: NoteModel;
}

const Note = ({ note }: NoteProps) => {
  // check if note was updated
  const wasUpdated = note.updatedAt > note.createdAt;

  // make timestamp human-readable
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>
          {createdUpdatedAtTimestamp}
          {wasUpdated && "updated"}
        </CardDescription>
      </CardHeader>
      <Separator className="mb-2" />
      <CardContent>
        <p className="whitespace-pre-line">
            {note.content}
        </p>
      </CardContent>
    </Card>
  );
};
export default Note;
