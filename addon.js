const { addonBuilder } = require("stremio-addon-sdk");
const sources = require("./sources");

const PUBLIC_URL = (process.env.PUBLIC_URL || "https://forzayt.github.io/Metaverse_Stremio_Addon").replace(/\/+$/, "");

const manifest = {
    id: "metaverse",
    version: "1.0.0",
    name: "METAVERSE",
    description: "METAVERSE stream sources for Stremio.",
    logo: `${PUBLIC_URL}/images/logo.png`,
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: [],
    idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
    if (!id) return { streams: [] };

    const results = await Promise.all(sources.map(async (source) => {
        try {
            return await source.getStreams({ type, id });
        } catch (error) {
            console.error(`Stream source "${source.id}" failed for ${type} ${id}:`, error.message);
            return [];
        }
    }));

    return { streams: results.flat() };
});

module.exports = builder.getInterface();
