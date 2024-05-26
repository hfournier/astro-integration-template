import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";

export const integration = defineIntegration({
  name: "seomax",
  optionsSchema: z.object({
    site: z.object({
      /**
       * Website name to be appended to the title
       *
       */
      name: z.string(),
      /**
       * Separating character between title and site name
       * @default `"|"`
       *
       */
      separator: z
        .string()
        .length(1, "Separator must be a single character")
        .optional()
        .default("|"),
      /**
       * Charset of the website
       * @default `"utf-8"`
       */
      charset: z.string().optional().default("utf-8"),
      defaultImages: z
        .object({
          openGraph: z
            .object({
              imagePath: z.string(),
              imageAlt: z.string().optional(),
            })
            .optional(),
          twitter: z
            .object({
              imagePath: z.string(),
              imageAlt: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    }),
  }),
  setup({ name, options }) {
    return {
      hooks: {
        "astro:config:setup": (params) => {
          addVirtualImports(params, {
            name,
            imports: {
              "virtual:astro-seo-max/config": `export default ${JSON.stringify({
                site: {
                  name: options.site.name,
                  separator: options.site.separator,
                  charset: options.site.charset,
                  defaultImages: {
                    openGraph: options.site.defaultImages?.openGraph,
                    twitter: options.site.defaultImages?.twitter,
                  },
                },
              })}`,
            },
          });
        },
      },
    };
  },
});
