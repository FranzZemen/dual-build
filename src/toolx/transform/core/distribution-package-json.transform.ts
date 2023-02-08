/*
Created by Franz Zemen 02/08/2023
License Type: MIT
*/

import {Directory, Package} from '../../options/index.js';
import {increment, VersionIncrement} from '../../util/semver.js';
import {TransformPayload} from '../transform-payload.js';

export type DistributionPackagePayload = {
  project: Package,
  dist: Directory
  versionInc: VersionIncrement // What to increment for distribution.  Only really takes effect if transformed to published
}

export class DistributionPackageJsonTransform extends TransformPayload<DistributionPackagePayload> {
  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayload(payload: DistributionPackagePayload): Promise<void> {
    const project: Package = payload.project;
    const distPackage:Package = {
      name: project.name, // Need to support a) scoping, which might not be the project name in github, and b) a distribution project name
      // different from the github project name
      version: project.version ? increment(project.version, payload.versionInc) : '0.0.1',

    }
    return Promise.resolve(undefined);
  }

  protected transformContext(pipeIn: any, passedIn: DistributionPackagePayload | undefined): string {
    return 'creating distribution package with new version';
  }

}


