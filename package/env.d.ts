/// <reference types="astro/client" />

declare module "virtual:astro-seo-max/config" {
  const config: {
    site: {
      name: string;
      separator?: string;
      charset?: string;
      defaultImages?: {
        openGraph?: { imagePath: string; imageAlt?: string };
        twitter?: { imagePath: string; imageAlt?: string };
      };
    };
  };

  export default config;
}
