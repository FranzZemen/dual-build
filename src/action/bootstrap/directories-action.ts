/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/


import {existsSync} from 'fs';
import {mkdirSync} from 'node:fs';
import {join, sep, normalize} from 'node:path';
import {inspect} from 'node:util';
import {bootstrapOptions, validate} from '../../options/bootstrap-options.js';
import {BootstrapOptions} from '../../options/index.js';
import {ActionStreamHookFunction, ActionOptions, DuplexAction, Payload} from '../action.js';

export type BootstrapPayload = Payload<BootstrapOptions>

export type DirectoriesActionStreamFunction = ActionStreamHookFunction<[directoryPath: string]>;

export type DirectoriesActionStreamOptions = ActionOptions & {
  beforeDirectoryCheck?: DirectoriesActionStreamFunction;
  beforeDirectoryCreate?: DirectoriesActionStreamFunction;
  afterDirectoryCreate?: DirectoriesActionStreamFunction;
  throwErrorOnExists?: boolean;
}

export class DirectoriesAction extends DuplexAction<boolean> {
  payloadBuffer: BootstrapPayload[] = [];

  constructor() {
    super();
  }


  _read(size: number) {
    let payload: BootstrapPayload;
    do {
      payload = this.payloadBuffer.pop();
      if (!payload) {
        console.log('No payload');
        return;
      } else {
        console.log('Pushing payload');
      }
    } while (this.push(payload) === true);
  }


  _write(payload: BootstrapPayload, notUsed: BufferEncoding, callback: (error?: (Error | null)) => void) {
    try {
      const options = payload.options;
      const result = validate(options);
      if (result !== true) {
        console.warn(`Invalid boostrap options ${inspect(payload, false, 10, true)}`);
        callback(new Error('Invalid boostrap options'));
        return;
      }
      // Create root
      try {
        const path = normalize(payload.options.directories.root);
        console.log(`Root: ${path}`)

        path
          .split(sep)
          .reduce((prevPath, folder) => {
            const currentPath = join(prevPath, folder, sep);
            if (!existsSync(currentPath)) {
              console.log(`Creating directory ${currentPath}`);
              mkdirSync(currentPath);
            } else {
              console.log(`Not creating directory ${currentPath} already exists`)
            }
            return currentPath;
          }, '');
      } catch (err) {
        console.error(err);
        callback(err);
        return;
      }
      this.payloadBuffer.push(payload);
      callback();
    } catch (err) {
      console.error(err);
      callback(err);
      return;
    }
  }

  execute() {
    return true;
  }

  /*
  createDirectory (path: string ) {
    const path = normalize(payload.options.directories.root);
    console.log(`Root: ${path}`)

    path
      .split(sep)
      .reduce((prevPath, folder) => {
        const currentPath = join(prevPath, folder, sep);
        if (!existsSync(currentPath)) {
          console.log(`Creating directory ${currentPath}`);
          mkdirSync(currentPath);
        } else {
          console.log(`Not creating directory ${currentPath} already exists`)
        }
        return currentPath;
      }, '');
  }

   */
}


