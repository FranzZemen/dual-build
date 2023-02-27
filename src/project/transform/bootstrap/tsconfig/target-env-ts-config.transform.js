/*
Created by Franz Zemen 01/10/2023
License Type:
*/
import _ from 'lodash';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultTargetEnvironmentOptions } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
export class TargetEnvTsConfigTransform extends TransformPayload {
    constructor(depth) {
        super(depth);
    }
    executeImplPayload(passedIn) {
        if (!passedIn) {
            throw new Error('Undefined payload');
        }
        else {
            const targetEnvironmentOptions = _.merge({}, defaultTargetEnvironmentOptions);
            targetEnvironmentOptions.module = passedIn.targetOption.module;
            targetEnvironmentOptions.target = passedIn.targetOption.target;
            targetEnvironmentOptions.moduleResolution = passedIn.targetOption.moduleResolution;
            targetEnvironmentOptions.outDir = `../transient/${passedIn.targetOption.nickName}/dist`;
            targetEnvironmentOptions.declarationDir = `../transient/types`;
            targetEnvironmentOptions.tsBuildInfoFile = `../transient/${passedIn.targetOption.nickName}/tsBuildInfo.json`;
            return writeFile(join(passedIn.path, `tsconfig.${passedIn.targetOption.nickName}.json`), JSON.stringify(targetEnvironmentOptions, null, 2), { encoding: 'utf-8' });
        }
    }
    transformContext(pipeIn, passedIn) {
        return `${passedIn.targetOption.nickName} {target: ${passedIn.targetOption.target}, module:${passedIn.targetOption.module}, moduleResolution:${passedIn.targetOption.moduleResolution}}`;
    }
}
