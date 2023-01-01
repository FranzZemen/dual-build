/*
Created by Franz Zemen 12/20/2022
License Type: 
*/

import {resolve} from 'node:path';
import {chdir, cwd} from 'node:process';
import {ContainsDirectories, ContainsRoot, DirectoryPath} from '../../options/directories.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {Action} from '../action.js';


export type ChangeWorkingDirectoryPayload = {
  rootPath: string
}

export class ChangeWorkingDirectory extends Action<ChangeWorkingDirectoryPayload, undefined, void> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  executeImpl(payload: ChangeWorkingDirectoryPayload): Promise<void> {
    if (payload) {
      try {
        const newCwd = payload.rootPath;
        this.log.info(`current working directory is ${cwd()}`, 'task-internal')
        const newCwdPath = resolve(cwd(), newCwd);
        chdir(newCwdPath);
        this.log.info(`new working directory is ${cwd()}`, 'warn');
        return Promise.resolve();
      } catch (err) {
        const error = processUnknownError(err);
        this.log.error(error);
        return Promise.reject(error);
      }
    } else {
      throw new Error('Undefined payload');
    }
  }

  public actionContext(payload: ChangeWorkingDirectoryPayload): string {
    return payload ? payload.rootPath : '';
  }
}
