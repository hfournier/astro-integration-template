# Astro SEO Max (astro-seo-max)

Astro SEO Max allows developers to add SEO metadata to their Astro project without having to think about `<meta>` tags. Just enter the metadata into a type-safe prop in the frontmatter, pass it to the Seo component and astro-seo-max will handle the rest.

To see how to get started, check out the [package README](./package/README.md)

## Goals

Our primary goal in creating this Astro integration is to make it easy for developers to add Search Engine Optimization (SEO) metadata to their Astro project. Most developers don't enjoy adding `<meta>` tags to their code, but everyone knows that it's essential for search engines to index your content. So, we created astro-seo-max to help make that task a little less painful. We've included support for the basic SEO tags, as well as all the [Open Graph](https://ogp.me/) and [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) options.

We also wanted to help developers avoid making mistakes when manually entering `<meta>` tags in their project. We've provided a zod-based SEO schema to use and with [Content Collections](https://docs.astro.build/en/guides/content-collections/), as well as a [TypeScript](https://www.typescriptlang.org/) model, to ensure that both your markdown and [Astro Page](https://docs.astro.build/en/basics/astro-pages/) frontmatter seo metadata are type-safe.

Finally, we wanted to take advantage of Astro's image optimization capabilites to simplifiy the addition of Open Graph and Twitter card images to your projects. All you have to do is provide the path and filename of your images in the `openGraph.image` and `twitter.image` properties and we'll handle the rest. You can even provide defaults images to ensure that every page has an image.

## Licensing

[MIT Licensed](./LICENSE). Made with ❤️ by [HenriFournier.dev](https://github.com/hfournier).
