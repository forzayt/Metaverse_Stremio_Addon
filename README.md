# Stremio Addon

A minimal Stremio addon base built with [`stremio-addon-sdk`](https://github.com/Stremio/stremio-addon-sdk).

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
| `addon.js` | Manifest and catalog/meta handlers |
| `server.js` | Express server that exposes the addon |

## Adding Functionality

Implement your logic inside the handlers in `addon.js`:

- `defineCatalogHandler` — return `{ metas: [] }` with your catalog items.
- `defineMetaHandler` — return `{ meta }` with detailed metadata for a single item.
- `defineStreamHandler` — add `"stream"` to `manifest.resources` and return `{ streams: [] }`.

Update the catalog list and resources in `manifest` to match what your addon provides.
