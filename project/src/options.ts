/*
Created by Franz Zemen 11/25/2022
License Type: 
*/
/*
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {CommandReturn} from './task/commandFunction.js';

import {DefaultLogger} from './logger.js';
import pkg from './src_dirname.cjs';

const {_dirname} = pkg;








export type UniversalOptions = {
}










export type CommandRef = string;
export type ScriptRef = string;

export type Command<T extends UniversalOptions, R extends CommandReturn> = {
  ref: CommandRef;
  path?: string;
  source: string;
  commandFunction: string;
  options: T;
}
export type Script = {
  ref: ScriptRef;
  path?: string;
  commandRefs: CommandRef[];
}



export type BuildOptions = {
  directories: Directories,
  sources: Source[],
  scripts: Script[]
  commands: Command<any, any>[]
}


export type Reference = {
  supportedPackageManagers: PackageManager[]
}

export type Options = {
  bootstrap: Bootstrap,
  reference: Reference,
  buildOptions: BuildOptions
}


// TODO: Validation
export function loadBuildOptions(filename?: string): BuildOptions {
  return loadOptions<BuildOptions>('build-options.json', filename);
}

function loadOptions<TOptions>(usualFileName: string, filename?: string): TOptions {
  let path: string;
  let options: TOptions;
  try {
    path = join(cwd(), filename ? filename : usualFileName);
    options = JSON.parse(readFileSync(path, {encoding: 'utf-8'}));
    // TODO: Validate options, replacing all defaults (then you don't need to load defaults?).
    return options;
  } catch (err) {
    const logger = new DefaultLogger();
    logger.info(`Local options file ${path} not found, loading defaults`);

    path = join(_dirname, `default-${usualFileName}`);
    try {
      options = JSON.parse(readFileSync(path, {encoding: 'utf-8'}));
      return options;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

export function isOptions(options: any | Options): options is Options {
  return 'directories' in options;
}

export function isBuildOptions(options: any | BuildOptions): options is BuildOptions {
  return 'tscProject' in options;
}
*/
