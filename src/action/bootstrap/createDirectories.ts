/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {existsSync} from 'fs';
import {inspect} from 'node:util';
import {isDirectory} from '../../options/directories.js';
import {Directories} from '../../options/index.js';
import {mkdir} from 'node:fs/promises';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';

export function createDirectories(directories:Directories): Promise<true> {
  try {
    if(existsSync(directories.root)) {
      const err = new Error (`Project folder ${directories.root} already exists`);
      console.error(err);
      return Promise.reject(err);
    }
    const result = mkdirSync(directories.root, {recursive: true});
    console.log(`makeDirSync: ${result}`)
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
  const paths: string[] = [];
  const promises: Promise<undefined | string>[] = [];
  for(let key of Object.keys(directories)) {
    if(key === 'root') {
      continue;
    }
    const dir = directories[key];
    if(isDirectory(dir)) {
      const path = join(directories.root, dir.directoryPath);
      paths.push(path)
      promises.push(mkdir(path,{recursive: true}));
    }
  }

  return Promise.allSettled(promises)
    .then((results) => {
      const failed: string[] = [];
      results.forEach((result, ndx) => {
        if(result.status === 'rejected') {
          failed.push(`Failed to create ${paths[ndx]}: ${result.reason}`);
        }
      })
      if(failed.length > 0) {
        console.warn(`Failed to create: ${inspect(failed, false, 10, true)}`);
        return Promise.reject(new Error (`Failed to create: ${inspect(failed, false, 10, true)}`));
      } else {
        return true;
      }

    })

  return Promise.resolve(true);
}





