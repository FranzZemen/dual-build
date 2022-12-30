/*
Created by Franz Zemen 12/04/2022
License Type: 
*/
import {Directory} from '../options/directories.js';

export type JsonFileDescriptor<T> = {
  filename: string;
  dir: Directory;
  jsonObject: T;
}
