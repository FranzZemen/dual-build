/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import _ from 'lodash';
import {Package} from '../../options/index.js';
import {Transform, TransformIn} from '../../transform/index.js';

/**
 * Updates a package - updates an existing entry or adds a new one, but does not remove existing entries
 */
export class UpdatePipedPackageTransform extends Transform<Package, Package, Package> {
  constructor(depth: number) {super(depth);}

  protected  executeImpl(pipeIn: Package | undefined, payload?: Package): Promise<Package> {
    if(!pipeIn || ! payload) {
      return Promise.reject(new Error('Unreachable code'));
    }
    this.contextLog.infoSegments([{treatment:'info', data:'piped in:'},{treatment: 'info', data: pipeIn}, {treatment: 'info', data:'payload'},{treatment: 'info', data: payload}]);
    const merged = _.merge(pipeIn, payload);
    return Promise.resolve(merged);
  }


  protected transformContext(pipeIn: TransformIn<Package>, passedIn: undefined): string {
    return `updating package.json`;
  }
}
