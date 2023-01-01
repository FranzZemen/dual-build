/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/


import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {Directory} from '../../../options/index.js';
import {Action} from '../../action.js';


export type CreateProjectDirectoryPayload = {
  root: Directory;
  directory: Directory
} | undefined;

export class CreateProjectDirectory extends Action<CreateProjectDirectoryPayload, CreateProjectDirectoryPayload, void> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public executeImpl(payload: CreateProjectDirectoryPayload): Promise<void> {
    if (payload) {
      const path = join(cwd(), join(payload.root.directoryPath, payload.directory.directoryPath));
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

  public actionContext(payload: CreateProjectDirectoryPayload): string {
    return payload ? payload.directory.directoryPath : '';
  }
}
