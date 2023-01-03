/*
Created by Franz Zemen 12/25/2022
License Type: MIT
*/

/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {existsSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {ContainsRoot, Directory} from '../../../options/directories.js';
import {processUnknownError} from '../../../util/process-unknown-error-message.js';
import {Transform} from '../../transform.js';


/**
 * Passing a 2nd parameter because instantiating code cannot distinguish between one or 2 parameters.
 */
export class CreateRootDirectory extends Transform<Directory | undefined, Directory | undefined, Directory> {
  constructor(logDepth: number) {
    super(logDepth);
  }
  executeImpl(rootDirectory: Directory | undefined, override?: Directory | undefined): Promise<Directory> {
    if(rootDirectory === undefined && override) {
      rootDirectory = override;
    }
    if(rootDirectory) {
      try {
        if (rootDirectory.directoryPath === 'NOT_DEFINED') {
          const msg = 'Undefined root folder';
          this.log.info(msg, 'error');
          this.errorCondition = true;
          return Promise.reject(new Error(msg));
        }
        if (existsSync(rootDirectory.directoryPath)) {
          const msg = `project root folder ${rootDirectory.directoryPath} already exists, not creating`;
          this.log.info(msg, 'error');
          this.errorCondition = true;
          return Promise.reject(new Error(msg));
        }
        const path = join(cwd(), rootDirectory.directoryPath);
        mkdirSync(path, {recursive: true});
        this.log.info(`created ${path}`, 'task-internal');
        return Promise.resolve(rootDirectory);
      } catch (err) {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
    } else {
      throw new Error ('Undefined payload');
    }
  }
  public transformContext(rootDirectory: Directory): string {
    return rootDirectory ? rootDirectory.directoryPath : '';
  }
}
