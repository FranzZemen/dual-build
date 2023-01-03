/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/


import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {Directory} from '../../../options/index.js';
import {TransformPayloadIn} from '../../transform-payload-in.js';
import {Transform} from '../../transform.js';


export type CreateProjectDirectoryPayload = {
  root: Directory;
  directory: Directory
} | undefined;

export class CreateProjectDirectory extends TransformPayloadIn<Directory, Directory> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public executeImpl(root: Directory, directory?: Directory): Promise<void> {
    if (root && directory) {
      const path = join(cwd(), join(root.directoryPath, directory.directoryPath));
      if (existsSync(path)) {
        const msg = `Project folder ${path} already exists, skipping`;
        this.log.warn(msg);
        return Promise.resolve();
      } else {
        return mkdir(path, {recursive: true})
          .then(() => {
            this.log.info(`created ${path}`, 'task-internal')
            return;
          });
      }
    } else {
      throw new Error('Undefined payload');
    }
  }

  public transformContext(payload: Directory, override: Directory): string {
    return override ? override.directoryPath : '';
  }
}
