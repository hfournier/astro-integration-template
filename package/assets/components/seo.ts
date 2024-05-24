import { z, type SchemaContext } from "astro:content"

const defaultOgImage = "@assets/seo-default-opengraph-image.png"
const defaultTwitterImage = "@assets/seo-default-twitter-image.png"

export const seoSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string().max(60, { message: "Title should be 60 or fewer characters long" }),
		description: z
			.string()
			.max(160, { message: "Description should be 160 or fewer characters long" }),
		charset: z.string().default("utf-8").optional(),
		canonical: z.string().url().optional(),
		noFollow: z.boolean().default(false).optional(),
		noIndex: z.boolean().default(false).optional(),
		openGraph: z
			.object({
				title: z.string(),
				type: z.string().default("website"),
				url: z.string().url().optional(),
				image: z
					.preprocess((val) => (val ? val : defaultOgImage), image())
					.refine((im: ImageMetadata) => im.height >= 200 && im.width >= 200, {
						message: "The minimum allowed Open Graph image dimension is 200 x 200 pixels"
					}),
				imageAlt: z.string().optional(),
				optional: ogOptionalSchema.optional(),
				article: articleSchema.optional(),
				audio: ogAudioSchema.optional(),
				book: bookSchema.optional(),
				musicAlbum: musicAlbumSchema.optional(),
				musicPlaylist: musicPlaylistSchema.optional(),
				musicRadioStation: musicRadioStationSchema.optional(),
				musicSong: musicSongSchema.optional(),
				profile: profileSchema.optional(),
				video: ogVideoSchema.optional(),
				videoEpisode: videoEpisodeSchema.optional(),
				videoMovie: videoMovieSchema.optional(),
				videoOther: videoMovieSchema.optional(),
				videoTvShow: videoMovieSchema.optional()
			})
			.optional(),
		twitter: twitterSchema({ image }).optional()
	})

export const articleSchema = z.object({
	publishedTime: z.date().or(z.string()).optional(),
	modifiedTime: z.date().or(z.string()).optional(),
	expirationTime: z.date().or(z.string()).optional(),
	publisher: z
		.string()
		.url()
		.refine((url) => url.startsWith("https://www.facebook.com/"), {
			message: "article:publisher should link to a Facebook page"
		})
		.optional(),
	authors: z.array(z.string().url()).optional(),
	tags: z.array(z.string()).optional()
})

export const bookSchema = z.object({
	authors: z.array(z.string()).optional(),
	isbn: z.string().optional(),
	releaseDate: z.date().or(z.string()).optional(),
	tags: z.array(z.string()).optional()
})

export const musicAlbumSchema = z.object({
	songs: z
		.array(
			z.object({
				url: z.string().url(),
				disc: z
					.number()
					.refine((d) => d > 0, { message: "music:song:disc should have a positive disc number" })
					.optional(),
				track: z
					.number()
					.refine((t) => t > 0, { message: "music:song:track should have a positive track number" })
					.optional(),
				musicians: z.array(z.string().url()).optional()
			})
		)
		.optional(),
	releaseDate: z.date().or(z.string()).optional()
})

export const musicPlaylistSchema = z.object({
	songs: z
		.array(
			z.object({
				url: z.string().url(),
				disc: z
					.number()
					.refine((d) => d > 0, { message: "music:song:disc should have a positive disc number" })
					.optional(),
				track: z
					.number()
					.refine((t) => t > 0, { message: "music:song:track should have a positive track number" })
					.optional()
			})
		)
		.optional(),
	creator: z.string().url().optional()
})

export const musicRadioStationSchema = z.object({
	creator: z.string().url().optional()
})

export const musicSongSchema = z.object({
	duration: z
		.number()
		.refine((d) => d > 0, {
			message: "music:duration should have a positive duration"
		})
		.optional(),
	albums: z
		.array(
			z.object({
				url: z.string().url(),
				disc: z
					.number()
					.refine((d) => d > 0, { message: "music:album:disc should have a positive disc number" })
					.optional(),
				track: z
					.number()
					.refine((t) => t > 0, {
						message: "music:album:track should have a positive track number"
					})
					.optional()
			})
		)
		.optional(),
	musicians: z.array(z.string().url()).optional()
})

export const ogAudioSchema = z.object({
	url: z.string().url().optional(),
	mimeType: z.string().optional()
})

// determiner: z.enum(["a", "an", "the", "", "auto"])
export const ogOptionalSchema = z.object({
	description: z.string().optional(),
	determiner: z
		.union([z.literal("a"), z.literal("an"), z.literal("the"), z.literal(""), z.literal("auto")])
		.default("")
		.optional(),
	locale: z.string().default("en_US").optional(),
	localeAlternates: z.array(z.string()).optional(),
	siteName: z.string().optional()
})

export const ogVideoSchema = z.object({
	url: z.string().url().optional(),
	mimeType: z.string().optional(),
	height: z.number().optional(),
	width: z.number().optional()
})

export const profileSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	username: z.string().optional()
})

// card: z.enum(["summary", "summary_large_image", "app", "player"])
export const twitterSchema = ({ image }: SchemaContext) =>
	z
		.object({
			card: z.union([
				z.literal("summary"),
				z.literal("summary_large_image"),
				z.literal("app"),
				z.literal("player")
			]),
			site: z
				.string()
				.refine((s) => s.startsWith("@"), {
					message:
						'twitter:site must start with an "@". @username for the website used in the card footer.'
				})
				.optional(),
			siteId: z.string().optional(),
			creator: z
				.string()
				.refine((c) => c.startsWith("@"), {
					message:
						'twitter:creator must start with an "@". @username for the content creator / author.'
				})
				.optional(),
			creatorId: z.string().optional(),
			title: z.string().max(70, { message: "Should be 70 or fewer characters long" }).optional(),
			description: z
				.string()
				.max(200, { message: "Should be 200 or fewer characters long" })
				.optional(),
			image: z.preprocess((val) => (val ? val : defaultTwitterImage), image()).optional(),
			imageAlt: z
				.string()
				.max(420, { message: "Should be 420 or fewer characters long" })
				.optional()
		})
		.superRefine((twitter, ctx) => {
			if (
				twitter.card === "summary" &&
				twitter.image &&
				(twitter.image.height! < 144 || twitter.image.width! < 144)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_small,
					minimum: 144,
					type: "number",
					inclusive: true,
					message: `For a "${twitter.card}" twitter.card, the minimum allowed twitter.image dimension is 144 x 144 pixels`
				})
			}
			if (
				twitter.card === "summary_large_image" &&
				twitter.image &&
				(twitter.image.height! < 157 || twitter.image.width! < 300)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_small,
					minimum: 157,
					type: "number",
					inclusive: true,
					message: `For a "${twitter.card}" twitter.card, the minimum allowed twitter.image dimension is 300 x 157 pixels`
				})
			}
		})

export const videoMovieSchema = z.object({
	actors: z
		.array(
			z.object({
				profile: z.string().url(),
				role: z.string().optional()
			})
		)
		.optional(),
	directors: z.array(z.string().url()).optional(),
	duration: z
		.number()
		.refine((d) => d > 0, {
			message: "video:duration should have a positive duration"
		})
		.optional(),
	releaseDate: z.date().or(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	writers: z.array(z.string().url()).optional()
})

export const videoEpisodeSchema = videoMovieSchema.extend({
	series: z.string().url().optional()
})

const px = z.custom<`${number}px`>((val) => {
	return typeof val === "string" ? /^\d+px$/.test(val) : false
})

export type px = z.infer<typeof px> // `${number}px`

interface Meta extends HTMLMetaElement {
	property: string
}

const meta = z.custom<astroHTML.JSX.MetaHTMLAttributes>((val) => {
	return true
})
