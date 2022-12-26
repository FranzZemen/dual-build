/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {existsSync, mkdirSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {inspect} from 'node:util';
import {ContainsDirectories, Directories, DirectoryPath, isDirectory} from '../../../options/directories.js';
import {processUnknownError} from '../../../util/process-unknown-error-message.js';
import {Action} from '../../action.js';


export class CreateDirectories<ACTION_IN extends ContainsDirectories> extends Action<ACTION_IN, ACTION_IN> {
  constructor(logDepth = 1) {
    super(logDepth);
  }
  executeImpl(payload: ACTION_IN): Promise<ACTION_IN> {
   // wait Pipeline
     // .action<Directories,Directories,Directories>(new CreateRootDirectory<Directories>(), 'root-directory', this.logDepth + 1)

    const directories: Directories = payload.directories;
    try {
      if(directories.root.directoryPath === 'NOT_DEFINED') {
        const msg = 'Undefined root folder';
        this.log.info(msg, 'error');
        this.errorCondition = true;
        return Promise.reject(new Error(msg));
      }
      if (existsSync(directories.root.directoryPath)) {
        const msg = `Project folder ${directories.root.directoryPath} already exists, not creating`;
        this.log.info(msg, 'error');
        this.errorCondition = true;
        return Promise.reject(new Error(msg));
      }
      const result = mkdirSync(directories.root.directoryPath, {recursive: true});
    } catch (err) {
      const error = processUnknownError(err);
      this.log.error(error);
      return Promise.reject(error);
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
          this.log.warn(`Failed to create: ${inspect(failed, false, 10, true)}`);
          return Promise.reject(new Error(`Failed to create: ${inspect(failed, false, 10, true)}`));
        } else {
          return payload;
        }
      });


  }
}
