export declare enum StandardSource {
    ts = "ts",
    mts = "mts",
    cts = "cts",
    js = "js",
    mjs = "mjs",
    cjs = "cjs",
    json = "json",
    md = "md",
    xml = "xml"
}
export type Sources = StandardSource | string;
export declare const sources: Sources[];
