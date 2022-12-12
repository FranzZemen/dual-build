/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

