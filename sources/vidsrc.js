const { createEmbedSource } = require("./embed");

// https://vidsrc.sh/ - player pages live under /embed/movie and /embed/tv
module.exports = createEmbedSource({
    id: "vidsrc",
    name: "Vidsrc",
    movieBaseUrl: process.env.VIDSRC_MOVIE_BASE_URL || "https://vidsrc.sh/embed/movie",
    seriesBaseUrl: process.env.VIDSRC_TV_BASE_URL || "https://vidsrc.sh/embed/tv",
    movieParams: { autoPlay: "true" },
    seriesParams: { autoPlay: "true" }
});
