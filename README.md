# METAVERSE

A minimal Stremio addon base built with [`stremio-addon-sdk`](https://github.com/Stremio/stremio-addon-sdk), exposing stream sources only (no catalogs or metadata).

## Getting Started

```bash
npm install
npm start
```

The addon runs on `http://127.0.0.1:7000` by default. Set `PORT` to change it.

Install it in Stremio with:

```
http://127.0.0.1:7000/manifest.json
```

## Project Structure

| File | Purpose |
| --- | --- |
| `addon.js` | Manifest and stream handler |
| `server.js` | Express server that exposes the addon |
| `sources/` | Embed stream providers |
| `images/` | Static assets, including `logo.png` |

The manifest logo is built from `PUBLIC_URL` (defaults to the GitHub Pages URL) plus `/images/logo.png`. Set `PUBLIC_URL` when deploying elsewhere:

## Stream Sources

Each file in `sources/` exports an object with:

```js
{
  id,
  name,
  hosts,
  getStreams({ type, id }) -> Promise<stream[]>
}
```

The included providers are Vidcore, VidFast, VidNest, Vidsrc, and VixSrc. Their base URLs can be overridden with environment variables:

```env
VIDCORE_MOVIE_BASE_URL=
VIDCORE_TV_BASE_URL=
VIDFAST_MOVIE_BASE_URL=
VIDFAST_TV_BASE_URL=
VIDNEST_MOVIE_BASE_URL=
VIDNEST_TV_BASE_URL=
VIDSRC_MOVIE_BASE_URL=
VIDSRC_TV_BASE_URL=
VIXSRC_MOVIE_BASE_URL=
VIXSRC_TV_BASE_URL=
```

Add a new provider by creating a file in `sources/` and registering it in `sources/index.js`.

## In-App Playback

Stremio only plays media in-app when a stream has a direct `url` (MP4/HLS). The providers above return HTML player pages, so they are exposed through `externalUrl`, which Stremio opens in a browser.

`widgetPlayer` does not solve this: it existed in the archived 2018 addon docs but is not implemented in current Stremio clients, and it was removed from the current SDK docs. There is no iframe/webview stream source in `stremio-core` or `stremio-web`.

For in-app playback, a source must resolve a direct `.mp4` or `.m3u8` URL and return it as `url`:

```js
return [{
    url: "https://example.com/video.m3u8",
    title: "Example",
    behaviorHints: { notWebReady: true }
}];
```
