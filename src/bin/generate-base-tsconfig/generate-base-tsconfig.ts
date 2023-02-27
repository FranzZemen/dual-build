/*
Created by Franz Zemen 02/11/2023
License Type: 
*/

import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {defaultBaseCompilerOptions} from 'dual-build/project';

export function generate(projectRoot: string) {
  const base = {compilerOptions: defaultBaseCompilerOptions};
  // @ts-ignore
  base.compilerOptions.composite = true;
  // @ts-ignore
  base.compilerOptions.incremental = true;
  // @ts-ignore
  base.compilerOptions.declaration = true;

  writeFileSync(join(projectRoot, './tsconfig.base.json'), JSON.stringify(base, undefined, 2), {encoding: 'utf-8'});
}
