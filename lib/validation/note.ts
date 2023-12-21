// Using zod to validate the data being sent to the database (It must have a title). Zod can also be used to validate forms

import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  content: z.string().optional(),
});

// Creating a typescript type from this schema to get autocomplete

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

// schema validation for updating notes. Same with above but with an id
export const updateNoteSchema = createNoteSchema.extend({
  // we can also validate to make sure it's a type of mongodb Id if we want
  id: z.string().min(1),
});

// schema for deleting notees
export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});
