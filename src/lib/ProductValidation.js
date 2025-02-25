import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  section: z.array(z.string()).optional(),
  buyingPrice: z.number().nonnegative().optional(),
  price: z.number().nonnegative(),
  discountedPrice: z.number().nonnegative().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  image: z
    .array(z.string().url("Invalid image URL"))
    .nonempty("At least one image URL is required"),
  video: z.string().url("Invalid video URL").optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  brand: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  numReviews: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().min(1, "Slug is required"),
  warranty: z.string().optional(),
  returnable: z.boolean().optional(),
  returnableDays: z.number().min(1).optional(),
  cod: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Variant name is required"),
        value: z.string().min(1, "Variant value is required"),
        price: z.number().min(0, "Variant price must be non-negative"),
        stock: z.number().min(0, "Variant stock must be non-negative"),
        image: z.string().url("Invalid variant image URL").optional(),
      })
    )
    .optional(),
});
