/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/


import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {Directory} from '../../../options/index.js';
import {Action} from '../../action.js';

export type CreateProjectDirectoryPayload = {
  root: string;
  directory: Directory
}

export class CreateProjectDirectory extends Action<CreateProjectDirectoryPayload, string | undefined> {
  constructor() {
    super();
  }

  public executeImpl(payload: CreateProjectDirectoryPayload, bypass: undefined): Promise<string | undefined> {
    const path = join(payload.root, payload.directory.directoryPath);
    return mkdir(path, {recursive: true});
  }
}
