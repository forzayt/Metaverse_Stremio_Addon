const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

const TMDB_KEY = "b8e31efed6de570178942a39601e84b0";

const manifest = {
    id: "metaverse",
    version: "1.0.0",
    name: "Metaverse",
    description: "The only Metadata addon for stremio",
    logo: "https://forzayt.github.io/Metaverse_Stremio_Addon/images/logo.png",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
        {
            type: "movie",
            id: "popular_movies",
            name: "Metaverse Popular",
            posterShape: "landscape",
            extra: [{ name: "search" }, { name: "skip" }]
        },
        {
            type: "series",
            id: "popular_series",
            name: "Metaverse Popular",
            extra: [{ name: "search" }, { name: "skip" }]
        },
        {
            type: "movie",
            id: "netflix_movies",
            name: "Metaverse Netflix",
            extra: [{ name: "search" }, { name: "skip" }]
        },
        {
            type: "series",
            id: "netflix_series",
            name: "Metaverse Netflix",
            extra: [{ name: "search" }, { name: "skip" }]
        },
        {
            type: "movie",
            id: "metaverse_catalog",
            name: "Metaverse Malayalam",
            extra: [{ name: "search" }, { name: "skip" }]
        }
    ],
    idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

/* Convert TMDB → Detailed Metadata */
async function getTmdbDetails(tmdbId, type = "movie") {
    try {
        const endpoint = type === "movie" ? "movie" : "tv";
        const res = await axios.get(
            `https://api.themoviedb.org/3/${endpoint}/${tmdbId}`,
            { 
                params: { 
                    api_key: TMDB_KEY,
                    append_to_response: "external_ids"
                } 
            }
        );
        return res.data;
    } catch {
        return null;
    }
}

/* Malayalam Catalog */
builder.defineCatalogHandler(async ({ type, id, extra }) => {
    if (type !== "movie" && type !== "series") return { metas: [] };

    const skip = extra?.skip ? parseInt(extra.skip) : 0;
    const page = Math.round(skip / 20) + 1;
    const today = new Date().toISOString().split('T')[0];

    let results = [];

    if (extra?.search) {
        // Handle search
        const endpoint = type === "movie" ? "movie" : "tv";
        const res = await axios.get(`https://api.themoviedb.org/3/search/${endpoint}`, {
            params: {
                api_key: TMDB_KEY,
                query: extra.search,
                page: 1
            }
        });
        results = res.data.results || [];
    } else if (id === "popular_movies") {
        // Fetch Popular Movies
        const promises = [page, page + 1].map(p =>
            axios.get("https://api.themoviedb.org/3/movie/popular", {
                params: {
                    api_key: TMDB_KEY,
                    page: p
                }
            })
        );
        const responses = await Promise.all(promises);
        results = responses.flatMap(r => r.data.results || []);
    } else if (id === "popular_series") {
        // Fetch Popular Series
        const promises = [page, page + 1].map(p =>
            axios.get("https://api.themoviedb.org/3/tv/popular", {
                params: {
                    api_key: TMDB_KEY,
                    page: p
                }
            })
        );
        const responses = await Promise.all(promises);
        results = responses.flatMap(r => r.data.results || []);
    } else if (id === "netflix_movies") {
        // Fetch Netflix Movies (Provider ID 8)
        const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
            params: {
                api_key: TMDB_KEY,
                with_watch_providers: 8,
                watch_region: "US",
                sort_by: "popularity.desc",
                page: page
            }
        });
        results = res.data.results || [];
    } else if (id === "netflix_series") {
        // Fetch Netflix Series (Provider ID 8)
        const res = await axios.get("https://api.themoviedb.org/3/discover/tv", {
            params: {
                api_key: TMDB_KEY,
                with_watch_providers: 8,
                watch_region: "US",
                sort_by: "popularity.desc",
                page: page
            }
        });
        results = res.data.results || [];
    } else if (id === "metaverse_catalog") {
        // Fetch 3 pages to ensure sufficient content
        const promises = [page, page + 1, page + 2].map(p =>
            axios.get("https://api.themoviedb.org/3/discover/movie", {
                params: {
                    api_key: TMDB_KEY,
                    with_original_language: "ml",
                    "primary_release_date.lte": today,
                    sort_by: "primary_release_date.desc",
                    page: p
                }
            })
        );

        const responses = await Promise.all(promises);
        results = responses.flatMap(r => r.data.results || []);
    } else {
        return { metas: [] };
    }

    // Process items in chunks to avoid hitting API rate limits (429)
    const batchSize = 5;
    const validMetas = [];

    for (let i = 0; i < results.length; i += batchSize) {
        const chunk = results.slice(i, i + batchSize);
        const chunkPromises = chunk.map(async (m) => {
            const details = await getTmdbDetails(m.id, type);
            if (!details || !details.external_ids || !details.external_ids.imdb_id) return null;

            const imdb = details.external_ids.imdb_id;
            const releaseDate = details.release_date || details.first_air_date || "";
            const year = releaseDate ? releaseDate.split("-")[0] : "";
            const rating = details.vote_average ? details.vote_average.toFixed(1) : null;
            const genres = details.genres ? details.genres.map(g => g.name) : [];
            const runtime = details.runtime || (details.episode_run_time ? details.episode_run_time[0] : null);

            return {
                id: imdb,
                type: type,
                name: details.title || details.name,
                poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
                background: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null,
                description: details.overview,
                releaseInfo: year,
                imdbRating: rating,
                genres: genres,
                runtime: runtime ? `${runtime} min` : null,
                links: rating ? [{
                    name: `★ ${rating}`,
                    category: "label",
                    url: `https://www.themoviedb.org/${type === "movie" ? "movie" : "tv"}/${details.id}`
                }] : []
            };
        });

        const chunkResults = await Promise.all(chunkPromises);
        validMetas.push(...chunkResults.filter(m => m !== null));
    }

    return { metas: validMetas };
});

/* Cinemeta Metadata */
builder.defineMetaHandler(async ({ type, id }) => {
    if (type !== "movie" && type !== "series") return { meta: null };

    const res = await axios.get(
        `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`
    );
    return res.data;
});

module.exports = builder.getInterface();
