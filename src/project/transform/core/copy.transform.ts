/*
Created by Franz Zemen 03/11/2023
License Type: MIT
*/

import FastGlob from 'fast-glob';
import {copyFile} from 'fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {inspect} from 'node:util';
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

  protected executeImplPayload(payload: CopyPayload): Promise<void> {
    const currwd = cwd();
    return FastGlob(payload.glob, {cwd: join(currwd, payload.src)})
      .then(files => {
        files.forEach(file => {
          // Use Promise.all to aggregate all the file copies
          const promises: Promise<void>[] = [];
          this.contextLog.info(`copying from ${join(currwd, payload.src, file)} to ${join(currwd, payload.dest, file)}`, 'context');
          //return copyFile(join(cwd(), payload.src, file
          // console.warn(file);
        })
        return;
      })
  }

  protected transformContext(pipeIn: undefined, payload: CopyPayload): string | object {
    return payload;
  }
}
