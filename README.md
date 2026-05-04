# 🎬 Metaverse – The Ultimate Metadata Addon for Stremio

Metaverse is a comprehensive metadata discovery addon for Stremio, designed to provide high-quality movie and series information from various streaming platforms and genres.

> **Metaverse does NOT host, store, or distribute any video content.** It is a metadata-only provider.

---


## ✨ Features

* 🚀 **Multi-Platform Catalogs**: Discovery content from Netflix, Amazon Prime, Apple TV+, Hulu, and more.
* 🎥 **Specialized Collections**: Dedicated catalogs for Marvel, DC, SonyLIV, Zee5, and Malayalam cinema.
* 🔍 **Powerful Search**: Integrated search functionality across all supported types.
* ⚡ **Infinite Scroll**: Smooth browsing experience with stable pagination.
* 🖼 **High-Quality Posters**: Support for RPDB (Poster DB) for premium artwork.
* 🧠 **IMDb Integration**: Native ecosystem behavior using IMDb ID resolution.

---

## 🧱 How It Works

```
Stremio App
    ↓
Metaverse Addon
    ↓
TMDB / RPDB (Fetch Metadata & Posters)
    ↓
Official Stremio Metadata
    ↓
Streaming Addons (Attach streams automatically)
```

Metaverse focuses exclusively on **catalog & metadata**, allowing other community addons to handle the streaming part.

---

## 🛠 Installation

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed on your system.
* A [TMDB API Key](https://www.themoviedb.org/documentation/api) (Required).
* An [RPDB API Key](https://posterdb.cc/) (Optional, for high-quality posters).

### 2. Setup
1. Clone the repository:
```bash
git clone https://github.com/forzayt/Metaverse_Stremio_Addon.git
cd Metaverse_Stremio_Addon
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add your keys:
```env
TMDB_KEY=your_tmdb_api_key
RPDB_KEY=your_rpdb_api_key (optional)
PORT=7000
```

4. Start the server:
```bash
npm start
```

### 3. Usage in Stremio
* Open Stremio and go to **Addons**.
* Paste the manifest URL: `http://localhost:7000/manifest.json`
* Click **Install**.

---

## 📦 API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `/manifest.json` | Addon manifest for Stremio integration |
| `/catalog/{type}/{id}.json` | Returns content lists for specific catalogs |
| `/meta/{type}/{id}.json` | Returns detailed metadata for a specific item |

---

## 🛠 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **SDK**: Stremio Addon SDK
* **Data Sources**: TMDB API, RPDB API

---

## ⚖ Legal Disclaimer

Metaverse:
* ❌ Does **NOT** host or distribute copyrighted media.
* ❌ Does **NOT** scrape or index illegal sources.
* ❌ Does **NOT** provide streaming URLs or torrent links.
* ✅ Only aggregates **public metadata** via official APIs.

All trademarks, movie posters, and metadata belong to their respective owners.

---

## 🧑‍⚖ Responsibility

This project exists solely as a **metadata enhancer**. Any media streams displayed inside Stremio are supplied by **external addons** installed separately by the user. Metaverse has no control over third-party stream sources.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve keyword detection, caching, or performance.

---

## ❤️ Support

If you find this project useful, consider supporting the development.
Check out the landing page for more info: [Metaverse Website](https://metaverse-addon.onrender.com)
