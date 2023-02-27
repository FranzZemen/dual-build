export enum StandardSource {
  ts = 'ts',
  mts = 'mts',
  cts = 'cts',
  js = 'js',
  mjs = 'mjs',
  cjs = 'cjs',
  json = 'json',
  md = 'md',
  xml = 'xml'
}

export type Sources = StandardSource | string;
export const sources: Sources[] = [
  StandardSource.ts,
  StandardSource.mts,
  StandardSource.cts,
  StandardSource.js,
  StandardSource.mjs,
  StandardSource.cjs,
  StandardSource.json,
  StandardSource.md
];
