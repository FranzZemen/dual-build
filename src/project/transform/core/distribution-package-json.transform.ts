/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {readFile, writeFile} from 'fs/promises';
import * as path from 'path';
import {Exports, Imports, Package, TargetOptions} from '../../options/index.js';
import {TransformPayload} from '../transform-payload.js';


export type DistributionPackageJsonPayload = {
  targetPath: string;
  exclusions?: (keyof Package)[];
  inclusions?: Package;
  targetOptions?: TargetOptions | undefined;
} | undefined;


export class DistributionPackageJsonTransform extends TransformPayload<DistributionPackageJsonPayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected async executeImplPayload(payload: DistributionPackageJsonPayload): Promise<void> {
    if (!payload) {
      return;
    }
    const jsonStr = await readFile(path.join(process.cwd(), './package.json'), {encoding: 'utf-8'});
    const packageJson = JSON.parse(jsonStr) as Package;
    if (payload?.exclusions) {
      payload.exclusions.forEach(exclusion => delete packageJson[exclusion]);
    }
    if (payload?.inclusions) {
      Object.getOwnPropertyNames(payload.inclusions).forEach(property => {
        if (payload.inclusions) {
          packageJson[property] = payload.inclusions[property]
        }
      });
    }

    await writeFile(path.join(process.cwd(), payload.targetPath), JSON.stringify(packageJson, undefined, 2), {encoding: 'utf-8'});
  }

  protected transformContext(pipeIn: DistributionPackageJsonPayload | undefined, passedIn: DistributionPackageJsonPayload | undefined): string {
    return '';
  }
}
