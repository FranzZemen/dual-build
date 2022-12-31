/*
Created by Franz Zemen 12/20/2022
License Type: 
*/

import {resolve} from 'node:path';
import {chdir, cwd} from 'node:process';
import {ContainsDirectories, ContainsRoot, DirectoryPath} from '../../options/directories.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {Action} from '../action.js';


export class ChangeWorkingDirectory extends Action<ContainsDirectories, ContainsDirectories, void> {
  constructor(logDepth: number, protected directoryPath: DirectoryPath | 'root') {
    super(logDepth);
  }

  executeImpl(payload: ContainsDirectories): Promise<void> {
    if (payload) {
      try {
        const newCwd = payload.directories[this.directoryPath];
        const newCwdPath = resolve(cwd(), newCwd.directoryPath);
        chdir(newCwdPath);
        payload.directories[this.directoryPath].directoryPath = cwd();
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

  public actionContext(payload: ContainsDirectories): string {
    return '';
  }
}
