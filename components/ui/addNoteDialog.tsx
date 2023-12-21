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
import SubmitButton from "./submitButton";

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddNoteDialog = ({ open, setOpen }: AddNoteDialogProps) => {
  // From shadcn. It uses react-hook-form under the hood
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
  });

  // Handle form submission
  async function onSubmit(input: CreateNoteSchema) {
    alert(input);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
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
            <DialogFooter>
              {/* We create our own button because shadcn button doesn't have a loading state */}
              <SubmitButton type="submit" loading={form.formState.isSubmitting}>
                Submit
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddNoteDialog;
