/*
Created by Franz Zemen 12/11/2022
License Type: 
*/

import {access, readFile, writeFile} from 'node:fs/promises';
import {EOL} from 'os';
import {TransformIndependent} from "../../../../transform/index.js";
import {BuildError} from "../../../../util/index.js";
import {gitignore} from "../../../../options/index.js";

/**
 * Assumes cwd has been set, but verifies it
 */
export class InstallGitignore extends TransformIndependent {
  constructor(logDepth: number) {
    super(logDepth);
  }

  async executeImplIndependent(): Promise<void> {
    let currentFileContents = '';
    const gitIgnoreFile = './.gitignore';
    await access('./.gitignore')
      .then(async () => {
        currentFileContents = await readFile(gitIgnoreFile, {encoding: 'utf-8'});
      })
      .catch(async (err: unknown) => {
        if (err instanceof BuildError) {
          throw err;
        } else {
          return Promise.resolve();
          /*
          let newFileContents = '';
          gitignore.forEach(ignore => newFileContents += ignore + EOL);
          const path = './.gitignore';
          await writeFile(path, newFileContents, {encoding: 'utf-8'});*/
        }
      });
    gitignore.forEach(ignore => {
      if (!currentFileContents.includes(ignore)) {
        currentFileContents += `# ${ignore} inserted by dual-build${EOL}`;
        currentFileContents += ignore + EOL;
      }
    });
    await writeFile(gitIgnoreFile, currentFileContents, {encoding: 'utf-8'});
  }


  public transformContext(rootPath: undefined): string {
    return gitignore.join(EOL);
  }
}
