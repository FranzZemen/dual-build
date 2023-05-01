/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {writeFile} from 'fs/promises';
import {inspect} from 'node:util';
import path from 'path';
import {Package} from '../../options/index.js';
import {Transform} from '../../transform/index.js';

export type WritePackagePayload = {
  targetPath: string;
}

export class WritePackageTransform extends Transform<WritePackagePayload, Package, Package> {
  protected executeImpl(pipeIn: Package | undefined, payload: WritePackagePayload | undefined): Promise<Package> {
    if(pipeIn === undefined || payload === undefined) {
      return Promise.reject(new Error('Unreachable code'));
    }
    return writeFile(path.join(process.cwd(), payload.targetPath), JSON.stringify(pipeIn),{encoding: 'utf-8'})
      .then(() => pipeIn);
  }

  protected transformContext(pipeIn: Package | undefined, payload: WritePackagePayload | undefined): string | object | Promise<string | object> {
    return `writing ${payload? payload.targetPath : ''} ${inspect(pipeIn, {depth:10, showHidden: false, colors: true} )}`;
  }
}
