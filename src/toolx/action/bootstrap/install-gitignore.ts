/*
Created by Franz Zemen 12/11/2022
License Type: 
*/

import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {EOL} from 'os';
import {ContainsDirectories, ContainsRoot} from '../../options/directories.js';
import {gitignore} from '../../options/git-options.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {Action} from '../action.js';


export class InstallGitignore extends Action<ContainsDirectories, ContainsDirectories, void> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  async executeImpl(payload: ContainsDirectories): Promise<void> {
    if (payload) {
      if (payload.directories.root === undefined) {
        throw new Error('Root not initialized');
      }
      try {
        let file = '';
        gitignore.forEach(ignore => file += ignore + EOL);
        const path = join(payload.directories.root.directoryPath, '.gitignore');
        await writeFile(path, file, {encoding: 'utf-8'});
      } catch (err) {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
    } else {
      throw new Error ('Undefined payload');
    }
  }

  public actionContext(payload: ContainsDirectories): string {
    return '';
  }
}
