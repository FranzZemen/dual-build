/*
Created by Franz Zemen 02/25/2023
License Type: 
*/

import {readFile, writeFile} from 'fs/promises';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {esm} from '../../options/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../transform-payload.js';
import {ContainsTargetOptions} from './distribution-package-json.transform.js';

export class CompileTransform extends TransformPayload<ContainsTargetOptions> {
  protected async executeImplPayload(containsTargetOptions: ContainsTargetOptions): Promise<void> {
    const targetOptions = containsTargetOptions?.targetOptions;
    if(!targetOptions) {
      throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
    } else {
      const _cwd = cwd();
      const targetOptionsFileName = join(_cwd, './tsconfig.base.default-target.json');
      const packageFileName = join(_cwd,'./package.json');
      
      const targetOptionsStr = await readFile(targetOptionsFileName, {encoding:'utf-8'});
      const packageJsonTStr = await readFile(packageFileName, {encoding: 'utf-8'});
      
      
      
      
      
      await writeFile(packageFileName, packageJsonTStr, {encoding: 'utf-8'});
      await writeFile(targetOptionsFileName, targetOptionsStr, {encoding: 'utf-8'});
    }
    return Promise.resolve(undefined);
  }

  protected transformContext(pipeIn: undefined, passedIn: ContainsTargetOptions | undefined): string {
    return 'compiling';
  }
  
}
