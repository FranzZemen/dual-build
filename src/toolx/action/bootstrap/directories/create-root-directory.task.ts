/*
Created by Franz Zemen 12/25/2022
License Type: MIT
*/

/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {existsSync, mkdirSync} from 'node:fs';
import {ContainsRoot, Directory} from '../../../options/directories.js';
import {processUnknownError} from '../../../util/process-unknown-error-message.js';
import {Action} from '../../action.js';
import {CreateProjectDirectoryPayload} from './create-project-directory.js';


/**
 * Passing a 2nd parameter because instantiating code cannot distinguish between one or 2 parameters.
 */
export class CreateRootDirectory extends Action<ContainsRoot, ContainsRoot, void> {
  constructor(logDepth: number) {
    super(logDepth);
  }
  executeImpl(payload: ContainsRoot): Promise<undefined> {
    if(payload) {
      const rootDirectory: Directory = payload.root;
      try {
        if (rootDirectory.directoryPath === 'NOT_DEFINED') {
          const msg = 'Undefined root folder';
          this.log.info(msg, 'error');
          this.errorCondition = true;
          return Promise.reject(new Error(msg));
        }
        if (existsSync(rootDirectory.directoryPath)) {
          const msg = `Project folder ${rootDirectory.directoryPath} already exists, not creating`;
          this.log.info(msg, 'error');
          this.errorCondition = true;
          return Promise.reject(new Error(msg));
        }
        mkdirSync(rootDirectory.directoryPath, {recursive: true});
        return Promise.resolve(undefined);
      } catch (err) {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
    } else {
      throw new Error ('Undefined payload');
    }
  }
  public actionContext(payload: ContainsRoot): string {
    return payload ? payload.root.directoryPath : '';
  }
}
