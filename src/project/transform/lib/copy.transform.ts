/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/

import FastGlob from 'fast-glob';
import {copyFile} from 'fs/promises';
import {mkdir} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {cwd} from 'node:process';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../transform-payload.js';


export type CopyPayload = {
  src: string,
  dest: string,
  glob: string | '**/*.*',
  overwrite: true | false
}

export class CopyTransform extends TransformPayload<CopyPayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected async executeImplPayload(payload: CopyPayload): Promise<void> {
    const currwd = cwd();


    await FastGlob(payload.glob, {cwd: join(currwd, payload.src)})
      .then(files => {
        const copyPromises: Promise<void>[] = [];
        const sourceFileNames: string[] = [];
        files.forEach(file => {
          // Use Promise.all to aggregate all the file copies
          const sourceFileName = join(currwd, payload.src, file);
          const destFileName = join(currwd, payload.dest, file);
          const destDirectory = dirname(destFileName);
          this.contextLog.debug(`copying from ${sourceFileName} to ${destFileName}`, 'context');
          sourceFileNames.push(sourceFileName);
          copyPromises.push(mkdir(destDirectory, {recursive: true}).then(()=> copyFile(sourceFileName, destFileName)));
        });
        return Promise
          .allSettled(copyPromises)
          .then(results => {
            const errors: BuildError[] = [];
            results.forEach((result,index) => {
              if (result.status === 'rejected') {
                errors.push(new BuildError(`Error copying file ${sourceFileNames[index]}`, {cause: result.reason}, BuildErrorNumber.CopyFileError))
                this.contextLog.error(result.reason);
              }
            });
            if(errors.length) {
              const err = new BuildError('Errors copying files: ', {cause: errors}, BuildErrorNumber.CopyFilesError);
              this.contextLog.error(err);
              errors.forEach(error => this.contextLog.error(error));
              throw err;
            }
            return;
          });
      });
  }

  protected transformContext(pipeIn: undefined, payload: CopyPayload): string | object {
    return payload;
  }
}
