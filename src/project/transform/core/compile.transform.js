/*
Created by Franz Zemen 02/25/2023
License Type:
*/
import { readFile, writeFile } from 'fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { BuildError, BuildErrorNumber } from '../../util/index.js';
import { TransformPayload } from '../transform-payload.js';
export class CompileTransform extends TransformPayload {
    async executeImplPayload(containsTargetOptions) {
        const targetOptions = containsTargetOptions?.targetOptions;
        if (!targetOptions) {
            throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
        }
        else {
            const _cwd = cwd();
            const targetOptionsFileName = join(_cwd, './tsconfig.base.project.json');
            const packageFileName = join(_cwd, './package.json');
            const targetOptionsStr = await readFile(targetOptionsFileName, { encoding: 'utf-8' });
            const packageJsonTStr = await readFile(packageFileName, { encoding: 'utf-8' });
            await writeFile(packageFileName, packageJsonTStr, { encoding: 'utf-8' });
            await writeFile(targetOptionsFileName, targetOptionsStr, { encoding: 'utf-8' });
        }
        return Promise.resolve(undefined);
    }
    transformContext(pipeIn, passedIn) {
        return 'compiling';
    }
}
