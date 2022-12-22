/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {existsSync, mkdirSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {inspect} from 'node:util';
import {ContainsDirectories, Directories, DirectoryPath, isDirectory} from '../../options/directories.js';
import {Action} from '../action.js';



export class CreateDirectories<T extends ContainsDirectories> extends Action<T, T> {
  constructor() {
    super();
  }
  execute(payload: T): Promise<T> {
    const directories: Directories = payload.directories;
    try {
      if(directories.root.directoryPath === 'NOT_DEFINED') {
        const err = new Error('Undefined root folder');
        console.error(err);
        return Promise.reject(err);
      }
      if (existsSync(directories.root.directoryPath)) {
        const err = new Error(`Project folder ${directories.root.directoryPath} already exists`);
        console.error(err);
        return Promise.reject(err);
      }
      const result = mkdirSync(directories.root.directoryPath, {recursive: true});
      console.log(`makeDirSync: ${result}`)
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
    const paths: string[] = [];
    const promises: Promise<undefined | string>[] = [];
    for (let key of Object.keys(directories)) {
      let pathKey: DirectoryPath | 'root' = key as (DirectoryPath | 'root');
      if (pathKey !== 'root') {
        const dir = directories[pathKey];
        if (isDirectory(dir)) {
          const path = join(directories.root.directoryPath, dir.directoryPath);
          paths.push(path)
          promises.push(mkdir(path, {recursive: true}));
        }
      }
    }
    // We can launch these in parallel since they are independent actions under root.
    return Promise.allSettled(promises)
      .then((results) => {
        const failed: string[] = [];
        results.forEach((result, ndx) => {
          if (result.status === 'rejected') {
            failed.push(`Failed to create ${paths[ndx]}: ${result.reason}`);
          }
        })
        if (failed.length > 0) {
          console.warn(`Failed to create: ${inspect(failed, false, 10, true)}`);
          return Promise.reject(new Error(`Failed to create: ${inspect(failed, false, 10, true)}`));
        } else {
          return payload;
        }
      });
  }
}
