/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/

import {ValidationSchema} from 'fastest-validator';

export type DirectoryReference =
  'transient';




export type DBDirectory = {
  reference: DirectoryReference;
  name: string;
  depth: number | 0;
  subDirectories: DBDirectory[];
}

export type DBDirectoryMap = Map<DirectoryReference, DBDirectory>;

export type DirectoryPath =
  '.git'
  | 'node_modules'
  | '.dual-build'
  | '.dual-build/logs'
  | '.dual-build/options'
  | '.dual-build/packages'
  | '.dual-build/tsconfigs'
  | 'bin'
  | 'src'
  | 'src/bin-command'
  | 'test'
  | 'assets'
  | 'data'
  | 'transient'
  | 'transient/build'
  | 'transient/build/esm'
  | 'transient/build/commonjs'
  | 'transient/publish'
  | 'transient/publish/esm'
  | 'transient/publish/commonjs'
  | 'transient/publish/bin'
  | 'transient/testing'
  | 'transient/testing/esm'
  | 'transient/testing/commonjs';

export enum ProjectDirectoryName {
  git = '.git',
  node_modules = 'node_modules',
  dualBuild = '.dual-build',
  logs = 'logs',
  options = 'options',
  packages = 'packages',
  tsconfigs = 'tsconfigs',
  src = 'src',
  srcBinCommand = 'bin-command',
  test = 'test',
  bin = 'bin',
  assets = 'assets',
  data = 'data',
  transient = 'transient',
  build = 'build',
  buildEsm = 'esm',
  buildCommonJS = 'commonjs',
  publish = 'publish',
  publishEsm = 'esm',
  publishCommonJS = 'commonjs',
  publishBin = 'bin',
  testing = 'testing',
  testingEsm = 'esm',
  testingCommonJS = 'commonjs',
  notDefined = 'FOLDER_NOT_DEFINED',
}

export type DirectoryName = ProjectDirectoryName | string;

export type Directory = {
  directoryPath: DirectoryPath | string | 'NOT_DEFINED';
  name: DirectoryName;
  transient: boolean;
  autogenerated: boolean;
};

export type Directories = {
  [key in DirectoryPath | 'root']: Directory;
};




export const directories: Directories = {
  'root': {
    // This is set on a per-invocation basis
    directoryPath: 'NOT_DEFINED',
    name: ProjectDirectoryName.notDefined,
    transient: false,
    autogenerated: false,
  },
  '.git': {
    directoryPath: './.git',
    name: ProjectDirectoryName.git,
    transient: false,
    autogenerated:true
  },
  'node_modules': {
    directoryPath: './node_modules',
    name: ProjectDirectoryName.node_modules,
    transient: false,
    autogenerated:true
  },
  'assets': {
    directoryPath: './assets',
    name: ProjectDirectoryName.assets,
    transient: false,
    autogenerated:false
  },
  'data': {
    directoryPath: './data',
    name: ProjectDirectoryName.data,
    transient: false,
    autogenerated:false
  },
  '.dual-build': {
    directoryPath: './.dual-build',
    name: ProjectDirectoryName.dualBuild,
    transient: false,
    autogenerated:true
  },
  '.dual-build/logs': {
    directoryPath: './.dual-build/logs',
    name: ProjectDirectoryName.logs,
    transient: false,
    autogenerated:false
  },
  '.dual-build/options': {
    directoryPath: './.dual-build/options',
    name: ProjectDirectoryName.options,
    transient: false,
    autogenerated:false
  },
  '.dual-build/packages': {
    directoryPath: './.dual-build/packages',
    name: ProjectDirectoryName.packages,
    transient: false,
    autogenerated:false
  },
  '.dual-build/tsconfigs': {
    directoryPath: './.dual-build/tsconfigs',
    name: ProjectDirectoryName.tsconfigs,
    transient: false,
    autogenerated:false
  },
  'src': {
    directoryPath: './src',
    name: ProjectDirectoryName.src,
    transient: false,
    autogenerated:true
  },
  'src/bin-command': {
    directoryPath: './src/bin-command',
    name: ProjectDirectoryName.srcBinCommand,
    transient: false,
    autogenerated:false
  },
  'test': {
    directoryPath: './test',  // Actual location of test folder depends on test strategy
    name: ProjectDirectoryName.test,
    transient: false,
    autogenerated:false
  },
  'bin': {
    directoryPath: './bin',
    name: ProjectDirectoryName.bin,
    transient: false,
    autogenerated:false
  },
  'transient': {
    directoryPath: './transient',
    name: ProjectDirectoryName.transient,
    transient: true,
    autogenerated:true
  },
  'transient/build': {
    directoryPath: './transient/build',
    name: ProjectDirectoryName.build,
    transient: true,
    autogenerated:true
  },
  'transient/build/esm': {
    directoryPath: './transient/build/esm',
    name: ProjectDirectoryName.buildEsm,
    transient: true,
    autogenerated:true
  },
  'transient/build/commonjs': {
    directoryPath: './transient/build/commonjs',
    name: ProjectDirectoryName.buildCommonJS,
    transient: true,
    autogenerated:true
  },
  'transient/publish': {
    directoryPath: './transient/publish',
    name: ProjectDirectoryName.publish,
    transient: true,
    autogenerated:true
  },
  'transient/publish/bin': {
    directoryPath: './transient/publish/bin',
    name: ProjectDirectoryName.publishBin,
    transient: true,
    autogenerated:true
  },
  'transient/publish/esm': {
    directoryPath: './transient/publish/esm',
    name: ProjectDirectoryName.publishEsm,
    transient: true,
    autogenerated:true
  },
  'transient/publish/commonjs': {
    directoryPath: './transient/publish/commonjs',
    name: ProjectDirectoryName.publishCommonJS,
    transient: true,
    autogenerated:true
  },
  'transient/testing': {
    directoryPath: './transient/testing',
    name: ProjectDirectoryName.testing,
    transient: true,
    autogenerated:true
  },
  'transient/testing/esm': {
    directoryPath: './transient/testing/esm',
    name: ProjectDirectoryName.testingEsm,
    transient: true,
    autogenerated:true
  },
  'transient/testing/commonjs': {
    directoryPath: './transient/testing/commonjs',
    name: ProjectDirectoryName.testingCommonJS,
    transient: true,
    autogenerated:true
  }
};

export type ContainsDirectories = {
  directories: Directories;
} | undefined;

export type ContainsRoot = {
  'root': Directory;
} | undefined;


export function isDirectory (dir: any | Directory): dir is Directory {
  return 'directoryPath' in dir && 'folder' in dir && 'transient' in dir;
}


export const directoriesSchema: ValidationSchema = {
  root: {type: 'string', optional: true}
}

export const directoriesWrappedSchema: ValidationSchema = {
  $$strict: false,
  type: 'object',
  props: directoriesSchema
}
