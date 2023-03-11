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
  glob: string | '**/*.*'
}

export class CopyTransform extends TransformPayload<CopyPayload> {
  constructor(depth: number) {super(depth);}

  protected executeImplPayload(payload: CopyPayload): Promise<void> {
    return FastGlob(payload.glob, {cwd: join(cwd(), payload.src)})
      .then(files => {
        files.forEach(file => {
          // Use Promise.all to aggregate all the file copies
          this.log.warn(file);
        })
        return;
      })
  }

  protected transformContext(pipeIn: undefined, passedIn: CopyPayload | undefined): string {
    return inspect(passedIn, false, 10, true);
  }
}
