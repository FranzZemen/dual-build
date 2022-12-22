/*
Created by Franz Zemen 12/11/2022
License Type: 
*/

import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {EOL} from 'os';
import {ContainsDirectories} from '../../options/directories.js';
import {gitignore} from '../../options/git-options.js';
import {Action} from '../action.js';


export class InstallGitignore<T extends ContainsDirectories> extends Action<T,T> {
  constructor() {
    super();
  }
  async execute(payload: T): Promise<T> {
    if (payload.directories.root === undefined) {
      throw new Error('Root not initialized');
    }
    try {
      let file= ''
      gitignore.forEach(ignore => file += ignore + EOL)
      const path = join(payload.directories.root.directoryPath, '.gitignore');
      await writeFile(path, file, {encoding: 'utf-8'});
      return payload;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
