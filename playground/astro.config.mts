import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";
import seoMax from "astro-seo-max";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    seoMax({
      site: {
        name: "Append Site Name",
        separator: "-",
        defaultImages: { openGraph: { imagePath: "/src/assets/nothing.jpg" } },
      },
    }),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
  ],
});
