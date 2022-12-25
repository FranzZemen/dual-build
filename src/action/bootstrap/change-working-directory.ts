/*
Created by Franz Zemen 12/20/2022
License Type: 
*/

import {resolve} from 'node:path';
import {cwd, chdir} from 'node:process';
import {ContainsDirectories, Directories, DirectoryPath, Folder} from '../../options/directories.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {Action} from '../action.js';



export class ChangeWorkingDirectory<IN extends ContainsDirectories> extends Action<IN, IN> {
  constructor(protected directoryPath:DirectoryPath | 'root') {
    super();
  }

  executeImpl(payload:IN): Promise<IN> {
    try {
      const newCwd = payload.directories[this.directoryPath]
      const newCwdPath = resolve(cwd(), newCwd.directoryPath);
      chdir(newCwdPath);
      payload.directories[this.directoryPath].directoryPath = cwd();
      return Promise.resolve(payload);
    } catch(err) {
      const error = processUnknownError(err);
      this.log.error(error);
      return Promise.reject(error);
    }
  }
}
