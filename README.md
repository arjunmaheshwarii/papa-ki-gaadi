# Papa Ki Gaadi

Old songs for a long drive. 89 Hindi classics on eight cassettes in an old car stereo. Turn the key and it plays on its own.

## What's in this folder

| File | What it is |
| --- | --- |
| `index.html` | The whole site. One file, no build step. |
| `favicon.svg` | The little cassette icon in the browser tab. |
| `og.jpg` | The preview image people see when the link is shared on WhatsApp, Instagram or X. |

## Put it online (about 5 minutes)

**Easiest: Netlify Drop**
1. Go to app.netlify.com/drop.
2. Drag this whole folder onto the page.
3. You get a live link straight away. Rename it in Site settings.

**With GitHub + Vercel (recommended for a custom domain)**
1. Create a new GitHub repo and upload these files.
2. On vercel.com, click *Add New → Project*, import the repo and click *Deploy*. No settings to change.
3. To use your own domain, open *Settings → Domains* in Vercel and add it, then copy the DNS records it shows into your domain provider.

**After you have your domain:** open `index.html` and change `og.jpg` in the two `og:image` / `twitter:image` lines to the full link, like `https://yourdomain.in/og.jpg`. WhatsApp needs the full link to show the preview image.

## Testing locally

YouTube often refuses to play when the file is opened by double-clicking it. Run a tiny local server instead:

```
npx serve
```

Then open the `localhost` link it prints.

## Changing the songs

All songs live in the `TAPES` list near the top of the `<script>` in `index.html`. Each song looks like:

```js
{ t:"Musafir Hoon Yaaron", a:"Kishore Kumar", f:"Parichay", y:1972, id:'reuQDivpKRM' },
```

- `t` song title, `a` singer, `f` film, `y` year
- `id` is the part after `v=` in a YouTube link: `youtube.com/watch?v=`**`reuQDivpKRM`**

To add a tape, copy one whole `{ name:..., short:..., color:..., tracks:[...] }` block and change it. Side A and Side B are split automatically.

If an uploader has blocked their video from playing on other sites, the player skips it and moves on. If a song keeps getting skipped, swap its `id` for another upload of the same song (official label channels like Saregama, Shemaroo, Ultra and Goldmines usually work).

## How it plays

- Songs stream through YouTube's free embedded player. No API key or account is needed.
- The YouTube player runs hidden (1×1 pixel) behind the dashboard, the same way truckdrivermusic.in does it. YouTube's embed rules ask for a visible player of at least 200×200, so YouTube could block embedding on the site. To make it visible again, remove the `yt-hidden` styles and give the `#yt` box a normal size.
- Browsers block sound until the visitor taps once, which is why the site starts with "Turn the key".
- After that it plays nonstop: end of a tape moves to the next tape, and after the last tape it starts again.
- Each visitor's volume and last song are remembered in their own browser.

Songs belong to their owners and are streamed from YouTube.
