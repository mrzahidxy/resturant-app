import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  catSlug: z.string().min(1, "Category is required"),
  options: z.array(
    z.object({
      title: z.string().min(1, "Option title is required"),
      additionalPrice: z.number().min(0, "Additional price must be at least 0"),
    })
  ),
  file: z.any().refine((file) => file && typeof file === "object", {
    message: "File must be uploaded",
  }),
  isFeatured: z.number().min(0).max(1),
});