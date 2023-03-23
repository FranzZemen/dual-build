/*
Created by Franz Zemen 01/10/2023
License Type: 
*/
import _ from 'lodash';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {defaultTargetEnvironmentOptions, TargetOption} from '../../../options/index.js';
import {TransformPayload} from '../../core/transform-payload.js';


export type GenerateTsConfigPayload = {
  path: string;
  targetOption: TargetOption;
}

export class TargetEnvTsConfigTransform extends TransformPayload<GenerateTsConfigPayload> {
  constructor(depth: number) {
    super(depth);
  }

  public executeImplPayload(passedIn: GenerateTsConfigPayload | undefined): Promise<void> {
    if(!passedIn) {
      throw new Error ('Undefined payload');
    } else {
      const targetEnvironmentOptions = _.merge({}, defaultTargetEnvironmentOptions);
      targetEnvironmentOptions.module = passedIn.targetOption.module;
      targetEnvironmentOptions.target = passedIn.targetOption.target;
      targetEnvironmentOptions.moduleResolution = passedIn.targetOption.moduleResolution;
      targetEnvironmentOptions.outDir = `../transient/${passedIn.targetOption.nickName}/dist`;
      targetEnvironmentOptions.declarationDir = `../transient/types`;
      targetEnvironmentOptions.tsBuildInfoFile = `../transient/${passedIn.targetOption.nickName}/tsBuildInfo.json`;

      return writeFile(join(passedIn.path,`tsconfig.${passedIn.targetOption.nickName}.json`), JSON.stringify(targetEnvironmentOptions,null, 2), {encoding: 'utf-8'});
    }
  }

  public transformContext(pipeIn: undefined, passedIn: GenerateTsConfigPayload): string {
    return `${passedIn.targetOption.nickName} {target: ${passedIn.targetOption.target}, module:${passedIn.targetOption.module}, moduleResolution:${passedIn.targetOption.moduleResolution}}`
  }
}
