/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/

import FastGlob from 'fast-glob';
import {copyFile} from 'fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {inspect} from 'node:util';
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
    const promises: Promise<void>[] = [];
    await FastGlob(payload.glob, {cwd: join(currwd, payload.src)})
      .then(files => {
        files.forEach(file => {
          // Use Promise.all to aggregate all the file copies
          this.contextLog.info(`copying from ${join(currwd, payload.src, file)} to ${join(currwd, payload.dest, file)}`, 'context');
          promises.push(copyFile(join(currwd, payload.src, file), join(currwd, payload.dest, file)));
        });
      });
    let errors = false;
    await Promise
      .allSettled(promises)
      .then(results => {
        results.forEach(result => {
          if (result.status === 'rejected') {
            this.contextLog.error(result.reason);
            errors = true;
          }
          this.contextLog.info('Evalute result', 'context');
        });
      });
    if(errors) {
      return Promise.reject(new BuildError('Errors copying files: ', undefined, BuildErrorNumber.CopyFilesError))
    }
  }

  protected transformContext(pipeIn: undefined, payload: CopyPayload): string | object {
    return payload;
  }
}
