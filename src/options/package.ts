/*
Created by Franz Zemen 12/10/2022
License Type: 
*/

export type Version = `${number}.${number}.${number}`;

enum ModuleType {
  module = 'module',
  commonjs = 'commonjs'
}

export type Script = string;

export type Scripts = {
  [key: string]: Script
}

export type Binary = string;

export type Binaries = {
  [key: string]: Binary
}




export type Exports = string | {[key: string]: Exports;}


export type Package = {
  name?: string;
  description?: string;
  version?: Version;
  type?: ModuleType;
  scripts?: Scripts,
  bin?: Binaries,
  main?: string;
  exports: Exports;
  imports: Exports;
  license: string;
  author: string;
}
/*
const p: Package = {
  name: 'hello@hello',
  version: '0.0.1',
  type: Type.commonjs,
  exports: "hello"
};
*/
