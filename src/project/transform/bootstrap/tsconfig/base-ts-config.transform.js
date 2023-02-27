/*
Created by Franz Zemen 01/11/2023
License Type:
*/
import { writeFile } from 'fs/promises';
import { join } from 'node:path';
import { defaultBaseCompilerOptions } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
export class BaseTsConfigTransform extends TransformPayload {
    constructor(logDepth) {
        super(logDepth);
    }
    executeImplPayload(passedIn) {
        if (!passedIn) {
            return Promise.reject(new Error('Undefined Payload'));
        }
        else {
            const json = JSON.stringify({ compilerOptions: defaultBaseCompilerOptions }, null, 2);
            return writeFile(join(passedIn['.dual-build/tsconfigs'].directoryPath, 'tsconfig.base.json'), json, { encoding: 'utf-8' });
        }
    }
    transformContext(pipedIn, passedIn) {
        return '';
    }
}
