/*
Created by Franz Zemen 12/20/2022
License Type: 
*/

import {resolve} from 'node:path';
import {chdir, cwd} from 'node:process';
import {Directory} from '../../options/internal-index.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {TransformIn} from '../transform-in.js';
import {Transform} from '../transform.js';


export type ChangeWorkingDirectoryPayload = {
  rootPath: string
}

export class ChangeWorkingDirectory extends TransformIn<string> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  executeImplIn(rootDirectorPath: string): Promise<void> {
    if (rootDirectorPath) {
      try {
        const newCwd = rootDirectorPath;
        this.log.info(`current working directory is ${cwd()}`, 'task-internal')
        const newCwdPath = resolve(cwd(), newCwd);
        chdir(newCwdPath);
        this.log.info(`new working directory is ${cwd()}`, 'warn');
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(processUnknownError(err, this.log));
      }
    } else {
      throw new Error('Undefined payload');
    }
  }

  public transformContext(rootDirectoryPath: string): string {
    return rootDirectoryPath;
  }
}
