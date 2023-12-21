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
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddNoteDialog = ({ open, setOpen }: AddNoteDialogProps) => {
  // From shadcn. It uses react-hook-form under the hood
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      //Without this, the default value is 'null', and our error message doesn't display
    },
  });

  // add router to refresh the page after form submission or form error
  const router = useRouter();

  // create Toast notification
  const { toast } = useToast();

  // Handle form submission and add to db
  async function onSubmit(input: CreateNoteSchema) {
    try {
      // we don't need to add the full api route in nextJS
      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) throw Error("Status code: " + response.status);
      form.reset();

      // refresh page
      router.refresh();

      // dialog closed by default
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive"
      });
    }
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
