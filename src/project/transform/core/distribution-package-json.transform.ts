/*
Created by Franz Zemen 02/13/2023
License Type: 
*/

import {readFile, writeFile} from 'fs/promises';
import * as path from 'path';
import {isTargetOptions, Package, TargetOptions} from '../../options/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayloadIn} from '../transform-payload-in.js';

export type ContainsTargetOptions = {
  targetOptions: TargetOptions | undefined;
} | undefined;

export class DistributionPackageJsonTransform extends TransformPayloadIn<ContainsTargetOptions | undefined, ContainsTargetOptions | any> {
  constructor(depth: number) {
    super(depth);}

  protected async executeImplPayloadIn(pipeIn: ContainsTargetOptions | any, passedIn: ContainsTargetOptions | undefined): Promise<void> {
    // Preferentially take passedIn
    /*
    let contains : ContainsTargetOptions = undefined;
    if (passedIn && isTargetOptions(passedIn.targetOptions)) {
      contains = passedIn;
    } else if (pipeIn && isTargetOptions(pipeIn.targetOptions)) {
      contains = pipeIn;
    } else {
      throw new BuildError('Unreachable code', undefined,BuildErrorNumber.UnreachableCode);
    }*/
    // Load project package.json & modify
    const jsonStr = await readFile(path.join(process.cwd(), './package.json'), {encoding: 'utf-8'});
    const packageJson = JSON.parse(jsonStr) as Package;
    delete packageJson.type;
    delete packageJson.scripts;
    delete packageJson.imports;
    delete packageJson.exports;
    delete packageJson.bin;
    delete packageJson.devDependencies;
    packageJson.exports = {
      '.': {
        types: './types',
        import: './esm/index.js',
        require: './cjs/index.js'
      }
    }
    packageJson.main = './cjs/index.js';
    packageJson.types = './types';
    await writeFile(path.join(process.cwd(), './dist/package.json'), JSON.stringify(packageJson,undefined, 2), {encoding: 'utf-8'});
    await writeFile(path.join(process.cwd(), './dist/esm/package.json'), JSON.stringify({type: 'module'},undefined, 2), {encoding: 'utf-8'});
    await writeFile(path.join(process.cwd(), './dist/cjs/package.json'), JSON.stringify({type: 'commonjs'},undefined, 2), {encoding: 'utf-8'});
  }

  protected transformContext(pipeIn: ContainsTargetOptions | undefined, passedIn: ContainsTargetOptions | undefined): string {
    return '';
  }
}
