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

export type Source = StandardSource | string;
