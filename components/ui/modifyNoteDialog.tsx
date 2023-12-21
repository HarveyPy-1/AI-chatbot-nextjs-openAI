import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import ActionButton from "./actionButton";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface ModifyNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

const ModifyNoteDialog = ({
  open,
  setOpen,
  noteToEdit,
}: ModifyNoteDialogProps) => {
  // From shadcn. It uses react-hook-form under the hood
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
      //If there's no note to edit, the default value is 'null', and our error message doesn't display, hence the "".
    },
  });

  // delete state
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // add router to refresh the page after form submission or form error
  const router = useRouter();

  // create Toast notification
  const { toast } = useToast();

  // Handle form submission and add to db
  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        // if there's a note, do a PUT request
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        toast({
          description: "Note successfully updated!",
          variant: "successful" || "", //customized variant
        });
      } else {
        // we don't need to add the full api route in nextJS
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) throw Error("Status code: " + response.status);
        toast({
          description: "Note successfully added!",
          variant: "successful" || "", //customized variant
        });
        form.reset();
      }

      // refresh page
      router.refresh();

      // dialog closed by default
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  }

  // handle delete functionality
  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      toast({
        description: "Note successfully deleted!",
        variant: "successful" || "", //customized variant
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* FormField controls a single input field in the form */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  {/* Show error message */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Another field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  {/* Show error message */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {/* We create our own button because shadcn button doesn't have a loading state */}
              {noteToEdit && (
                <ActionButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete Note
                </ActionButton>
              )}
              <ActionButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                {noteToEdit ? "Update" : "Submit"}
              </ActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ModifyNoteDialog;
