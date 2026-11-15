const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.stremio.example",
    version: "1.0.0",
    name: "Stremio Addon",
    description: "A clean Stremio addon base.",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
        {
            type: "movie",
            id: "example_catalog",
            name: "Example Catalog",
            extra: [{ name: "search" }, { name: "skip" }]
        }
    ],
    idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async () => {
    return { metas: [] };
});

builder.defineMetaHandler(async () => {
    return { meta: null };
});

module.exports = builder.getInterface();
