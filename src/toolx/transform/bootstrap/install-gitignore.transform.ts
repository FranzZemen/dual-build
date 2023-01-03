/*
Created by Franz Zemen 12/11/2022
License Type: 
*/

import {writeFile} from 'node:fs/promises';
import {EOL} from 'os';
import {gitignore} from '../../options/git-options.js';
import {processUnknownError} from '../../util/process-unknown-error-message.js';
import {TransformIndependent} from '../transform-independent.js';

/**
 * Assumes cwd has been set, but verifies it
 */
export class InstallGitignore extends TransformIndependent {
  constructor(logDepth: number) {
    super(logDepth);
  }

  async executeImpl(rootPath: undefined): Promise<void> {
    try {
      let file = '';
      gitignore.forEach(ignore => file += ignore + EOL);
      const path = './.gitignore';
      await writeFile(path, file, {encoding: 'utf-8'});
    } catch (err) {
      const error = processUnknownError(err);
      this.log.error(error);
      throw error;
    }
  }


  public transformContext(rootPath: undefined): string {
    return '';
  }
}
