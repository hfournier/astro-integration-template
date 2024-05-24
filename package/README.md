# Astro SEO Max (`astro-seo-max`)

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows developers to add SEO metadata to their Astro project without having to think about `<meta>` tags. Just enter the metadata into a type-safe prop in the frontmatter, pass it to the `<Seo />` component and `astro-seo-max` will handle the rest.

## Usage

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-seo-max
```

```bash
npx astro add astro-seo-max
```

```bash
yarn astro add astro-seo-max
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-seo-max
```

```bash
npm install astro-seo-max
```

```bash
yarn add astro-seo-max
```

2. Add the integration to your astro config

```diff
+import integration from "astro-seo-max";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

### How To Use

TODO:how-to-use

In your `BaseLayout.astro` file (or whatever layout you're using), add a named slot:

```astro
<html>
  <head>
    ...
    <slot name="head" />
  </head>
  <body>
    ...
  </body>
</html>
```

If you have embedded layout files, like a `MainLayout.astro`, you can pass the named slot up to the next level:

```astro
<BaseLayout>
	<slot name="head" slot="head" />
  ...
	<slot />
  ...
</BaseLayout>
```

In Astro pages, like your home page (`src/pages/index.astro`), use the `<Seo />` component and pass the `seo` prop as a `const` or inline object:

```astro
---
import Seo from "astro-seo-max"
import BaseLayout from "@layouts/BaseLayout.astro"
import ogImage from "@assets/images/home-og-image.png"
import twImage from "@assets/images/home-tw-image.png"

const seo = {
	title: "Home Page",
	description: "This is a description of my home page",
  openGraph: {
    title: "Home Page",
    type: "website",
    image: ogImage,
    imageAlt: "An image of my home page",
    optional: {
      description: "This is a description of my home page"
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@your-site",
    creator: "@username",
    title: "Home Page",
    description: "This is a description of my home page",
    image: twImage,
    imageAlt: "An image of my home page",
  }
}
---

<BaseLayout>
	<Seo slot="head" {seo} />
  ...
</BaseLayout> 
```

or alternatively inline:

```astro
---
import Seo from "astro-seo-max"
import BaseLayout from "@layouts/BaseLayout.astro"
---

<BaseLayout>
	<Seo
		slot="head"
		seo={{
			title:
				"Home Page",
			description:
				"This is a description of my home page"
		}}
	/>
  ...
</BaseLayout> 
```

In the markdown of your Content Collections (e.g. `src/content/blogs/first-blog.md`), add the `seo` prop to the frontmatter:

```md
---
title: First Blog
description: This is the first blog
seo:
  title: First Blog
  description: This is the first blog
  openGraph:
    title: First Blog
    type: article
    image: "@assets/images/first-blog-og-image.png"
    imageAlt: An image of my first blog
    optional:
      description: This is the first blog
  twitter:
    card: summary_large_image
    site: "@your-site"
    creator: "@username"
    title: Home Page
    description: This is a description of my home page
    image: "@assets/images/first-blog-tw-image.png"
    imageAlt: An image of my home page
---

# First Blog
```

Then in your Astro pages (e.g. `src/pages/blog/[slug].astro`) use the `<Seo />` component with the `seo` prop from your content collection's frontmatter. If the `seo` is `undefined`, then fallback to the `title` and `description` from your content collection's frontmatter.

```astro
---
import type { GetStaticPaths } from "astro"
import { getCollection } from "astro:content"
import BlogLayout from "@layouts/BlogLayout.astro"
import Seo from "astro-seo-max"

export const getStaticPaths = (async () => {
	const blogs = await getCollection("blogs")
	return blogs.map((entry) => {
		return {
			params: { slug: entry.slug },
			props: { entry }
		}
	})
}) satisfies GetStaticPaths

const { entry } = Astro.props
const { Content } = await entry.render()
---

<BlogLayout>
	{
    entry.data.seo && (
      <Seo slot="head" seo={entry.data.seo} />
    )
  }
	{
		!entry.data.seo && (
			<Seo
				slot="head"
				seo={{ title: entry.data.title, description: entry.data.description }}
			/>
		)
	}
  ...
  <Content />
  ...
</BlogLayout>
```

## Supported Props

Prop Name | Type | Description
------------ | ------------- | -------------
title | string | The title of the page (will appear in the browser tab)
description | string | The description of what the page is about (will appear in search results)
charset | string | The character encoding of the page (optional, defaults to `utf-8`)
conical | string | The canonical URL for the page (optional, defaults to the current page URL)
noFollow | boolean | Whether to prevent indexing of the page (optional, defaults to `false`)
noIndex | boolean | Whether to prevent indexing of the page (optional, defaults to `false`)
openGraph | object | The Open Graph metadata for the page (optional)
openGraph.title | string | The title of your object as it should appear within the graph
openGraph.type | string | The type of your object (e.g. "website" or "article"). Depending on the type you specify, other properties may also be required. (defaults to "website")
openGraph.url | string | The canonical URL of your object that will be used as its permanent ID in the graph (optional, defaults to the current page URL)
openGraph.image | string | An image URL which should represent your object within the graph (image should be stored in `src/assets`, or other folder inside `src/`, and preferably at least 1200x630 pixels)
openGraph.imageAlt | string | A description of what is in the image (not a caption). If the page specifies an openGraph.image it should specify openGraph.alt (optional)
openGraph.optional.description | string | A one to two sentence description of your object (optional)
openGraph.optional.determiner | string | The word that appears before this object's title in a sentence. An enum of (a, an, the, "", auto). If auto is chosen, the consumer of your data should chose between "a" or "an" (optional, defaults to "").
openGraph.optional.locale | string | The locale these tags are marked up in. Of the format language_TERRITORY (optional, defaults to "en_US")
openGraph.optional.localeAlternate | string | An array of other locales this page is available in (optional)
openGraph.optional.siteName | string | If your object is part of a larger web site, the name which should be displayed for the overall site (optional)
openGraph.article | object | The article metadata for the page (optional, set openGraph.type to "article")
openGraph.article.authors | array | An array of authors (URLs) associated with this article (optional)
openGraph.article.expirationTime | string | The date when the article will expire (optional)
openGraph.article.modifiedTime | string | The date when the article was last modified (optional)
openGraph.article.publishedTime | string | The date when the article was published (optional)
openGraph.article.publisher | string | The publisher of the article (optional)
openGraph.article.tags | array | Tag words associated with this article (optional)
openGraph.audio | object | The audio metadata for the page (optional)
openGraph.audio.url | string | A URL to an audio file to accompany this object (optional)
openGraph.audio.mimeType | string | The MIME type of the audio file (optional)
openGraph.book | object | The book metadata for the page (optional, set openGraph.type to "book")
openGraph.book.author | string | The author of the book (optional)
openGraph.book.isbn | string | The ISBN of the book (optional)
openGraph.book.releaseDate | string | The release date of the book (optional)
openGraph.book.tags | array | Tag words associated with this book (optional)
openGraph.musicAlbum | object | The music album metadata for the page (optional, set openGraph.type to "music.album")
openGraph.musicAlbum.songs | array | An array of songs in the album (optional)
openGraph.musicAlbum.songs.disc | number | The disc number of the album (optional)
openGraph.musicAlbum.songs.musicians | array | An array of musicians (URLs) in the album (optional)
openGraph.musicAlbum.songs.track | number | The track number of the song (optional)
openGraph.musicAlbum.songs.url | string | A URL to a song in the album (optional)
openGraph.musicAlbum.releaseDate | string | The release date of the album (optional)
openGraph.musicPlaylist | object | The music playlist metadata for the page (optional, set openGraph.type to "music.playlist")
openGraph.musicPlaylist.songs | array | An array of songs in the playlist (optional)
openGraph.musicPlaylist.songs.disc | number | The disc number of the album (optional)
openGraph.musicPlaylist.songs.track | number | The track number of the song (optional)
openGraph.musicPlaylist.songs.url | string | A URL to a song in the playlist (optional)
openGraph.musicPlaylist.creator | string | The creator of the playlist (optional)
openGraph.musicRadioStation | object | The music radio station metadata for the page (optional, set openGraph.type to "music.radio_station")
openGraph.musicRadioStation.creator | string | The creator of the radio station (optional)
openGraph.musicSong | object | The music song metadata for the page (optional, set openGraph.type to "music.song")
openGraph.musicSong.duration | string | The duration of the song in seconds (optional)
openGraph.musicSong.albums | array | An array of albums that this song appears on (optional)
openGraph.musicSong.albums.disc | number | The disc number of the album (optional)
openGraph.musicSong.albums.musicians | array | An array of musicians (URLs) that this song appears on (optional)
openGraph.musicSong.albums.track | number | The track number of the song (optional)
openGraph.musicSong.albums.url | string | A URL to an album that this song appears on (optional)
openGraph.profile | object | The profile metadata for the page (optional, set openGraph.type to "profile")
openGraph.profile.firstName | string | The first name of the author (optional)
openGraph.profile.lastName | string | The last name of the author (optional)
openGraph.profile.username | string | A short unique string to identify them (optional)
openGraph.video | object | The video metadata for the page (optional)
openGraph.video.height | number | The height of the video in pixels (optional)
openGraph.video.mimeType | string | The MIME type of the video file (optional)
openGraph.video.width | number | The width of the video in pixels (optional)
openGraph.video.url | string | A URL to a video file that complements this object (optional)
openGraph.videoEpisode | object | The video episode metadata for the page (optional, set openGraph.type to "video.episode")
openGraph.videoEpisode.actors | array | An array of actors (URLs) in the episode (optional)
openGraph.videoEpisode.actors.profile | string | A URL to an actor's profile (optional)
openGraph.videoEpisode.actors.role | string | The role of the actor in the episode (optional)
openGraph.videoEpisode.directors | array | An array of directors (URLs) in the episode (optional)
openGraph.videoEpisode.duration | string | The episode's length in seconds (optional)
openGraph.videoEpisode.releaseDate | string | The release date of the episode (optional)
openGraph.videoEpisode.series | string | The series (URL) associated with the episode (optional)
openGraph.videoEpisode.tags | array | Tag words associated with this episode (optional)
openGraph.videoEpisode.writers | array | An array of writers (URLs) in the episode (optional)
openGraph.videoMovie | object | The video movie metadata for the page (optional, set openGraph.type to "video.movie")
openGraph.videoMovie.actors | array | An array of actors (URLs) in the movie (optional)
openGraph.videoMovie.actors.profile | string | A URL to an actor's profile (optional)
openGraph.videoMovie.actors.role | string | The role of the actor in the movie (optional)
openGraph.videoMovie.directors | array | An array of directors (URLs) in the movie (optional)
openGraph.videoMovie.duration | string | The movie's length in seconds (optional)
openGraph.videoMovie.releaseDate | string | The release date of the movie (optional)
openGraph.videoMovie.tags | array | Tag words associated with this movie (optional)
openGraph.videoMovie.writers | array | An array of writers (URLs) in the movie (optional)
openGraph.videoOther | object | The other video metadata for the page (optional, set openGraph.type to "video.other")
openGraph.videoOther.actors | array | An array of actors (URLs) in the other video (optional)
openGraph.videoOther.actors.profile | string | A URL to an actor's profile (optional)
openGraph.videoOther.actors.role | string | The role of the actor in the other video (optional)
openGraph.videoOther.directors | array | An array of directors (URLs) in the other video (optional)
openGraph.videoOther.duration | string | The other video's length in seconds (optional)
openGraph.videoOther.releaseDate | string | The release date of the other video (optional)
openGraph.videoOther.tags | array | Tag words associated with this other video (optional)
openGraph.videoOther.writers | array | An array of writers (URLs) in the other video (optional)
openGraph.videoTvShow | object | The video TV Show metadata for the page (optional, set openGraph.type to "video.tv_show")
openGraph.videoTvShow.actors | array | An array of actors (URLs) in the TV Show (optional)
openGraph.videoTvShow.actors.profile | string | A URL to an actor's profile (optional)
openGraph.videoTvShow.actors.role | string | The role of the actor in the TV Show (optional)
openGraph.videoTvShow.directors | array | An array of directors (URLs) in the TV Show (optional)
openGraph.videoTvShow.duration | string | The TV Show's length in seconds (optional)
openGraph.videoTvShow.releaseDate | string | The release date of the TV Show (optional)
openGraph.videoTvShow.tags | array | Tag words associated with this TV Show (optional)
openGraph.videoTvShow.writers | array | An array of writers (URLs) in the TV Show (optional)
twitter | object | The Twitter metadata for the page (optional)
twitter.card | string | The Twitter card type (must be one of "summary", "summary_large_image", "app", or "player", but only "summary" and "summary_large_image" are supported)
twitter.creator | string | @username of content creator (optional, used with "summary_large_image" cards)
twitter.creatorId | string | Twitter user ID of content creator (optional, used with "summary" and "summary_large_image" cards)
twitter.description | string | Description of content (maximum 200 characters) (optional, used with "summary", "summary_large_image", "player" cards)
twitter.site | string | @username of website. Either twitter:site or twitter:site:id is required (optional, used with all cards)
twitter.siteId | string | Same as twitter.site, but the user’s Twitter ID. Either twitter.site or twitter.siteId is required (optional, used with all cards)
twitter.title | string | Title of content (max 70 characters) (optional, used with "summary", "summary_large_image", "player" cards)
twitter.image | string | URL of image to use in the card. Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported. (optional, used with "summary", "summary_large_image", "player" cards)
twitter.imageAlt | string | A text description of the image conveying the essential nature of an image to users who are visually impaired. Maximum 420 characters. (optional, used with "summary", "summary_large_image", "player" cards)

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## References

[meta tags that Google supports](https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=en#meta-tags)
[The Open Graph protocol](https://ogp.me/)
[Meta - A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
[Meta - Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images)
[Twitter - Cards Markup Tag Reference](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)

## Licensing

[MIT Licensed](https://github.com/hfournier/blob/main/LICENSE). Made with ❤️ by [HenriFournier.dev](https://github.com/hfournier).

## Acknowledgements

Merci beacoup to [Florian Lefebvre](https://github.com/florian-lefebvre) for his help and support during the creation of this package... and for sharing his [Astro Integration Template](https://github.com/florian-lefebvre/astro-integration-template)!
