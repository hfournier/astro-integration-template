import { seoMaxSchema } from "astro-seo-max/types";
import { z, defineCollection, type SchemaContext } from "astro:content";

const blogSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().optional().default(false),
    createdAt: z.date(),
    modifiedAt: z.date().optional(),
    seo: seoMaxSchema({ image }).optional(),
  });

const blogCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: blogSchema,
});

export const collections = {
  blog: blogCollection,
};
