/*
Created by Franz Zemen 03/04/2023
License Type: 
*/

import _ from 'lodash';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';
import {Package} from '../../options/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../../transform/index.js';

export type UpdatePayloadPackagePayload = {
  targetPath: string;
  updates: Package;
}

export class UpdatePayloaddPackageTransform extends TransformPayload<UpdatePayloadPackagePayload> {
  constructor(depth: number) {super(depth);}

  protected executeImplPayload(payload: UpdatePayloadPackagePayload): Promise<void> {
    if(!payload) {
      return Promise.reject(new BuildError('Unreachable code',undefined, BuildErrorNumber.UnreachableCode));
    }
    this.contextLog.debug(payload.updates, 'info');
    return readFile(path.join(process.cwd(), payload.targetPath), {encoding: 'utf-8'})
      .then((data: string) => {
        let packageJson = JSON.parse(data);
        packageJson = _.merge(packageJson, payload.updates);
        return writeFile(path.join(process.cwd(), payload.targetPath), JSON.stringify(packageJson, undefined, 2), {encoding: 'utf-8'});
      })
  }

  protected transformContext(pipeIn: undefined, passedIn: UpdatePayloadPackagePayload | undefined): string {
    return `creating ${passedIn? passedIn.targetPath : ''}`;
  }

}
