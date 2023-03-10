/*
Created by Franz Zemen 03/04/2023
License Type: 
*/

import {writeFile} from 'fs/promises';
import path from 'path';
import {Package} from '../../options/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../transform-payload.js';

export type CreatePackagePayload = {
  targetPath: string;
  package: Package;
}

export class CreatePackageTransform extends TransformPayload<CreatePackagePayload> {
  constructor(depth: number) {super(depth);}

  protected executeImplPayload(payload: CreatePackagePayload): Promise<void> {
    if(!payload) {
      return Promise.reject(new BuildError('Unreachable code',undefined, BuildErrorNumber.UnreachableCode));
    }
    return writeFile(path.join(process.cwd(), payload.targetPath), JSON.stringify(payload.package, undefined, 2), {encoding: 'utf-8'});
  }

  protected transformContext(pipeIn: undefined, passedIn: CreatePackagePayload | undefined): string {
    return `creating ${passedIn? passedIn.targetPath : ''}`;
  }

}
