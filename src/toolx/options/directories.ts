/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/

import {ValidationSchema} from 'fastest-validator';

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

export enum Folder {
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
  notDefined = 'FOLDER_NOT_DEFINED'
}


export type Directory = {
  directoryPath: DirectoryPath | string | 'NOT_DEFINED';
  folder: Folder | string;
  transient: boolean;
};

export type Directories = {
  [key in DirectoryPath | 'root']: Directory;
};




export const directories: Directories = {
  'root': {
    // This is set on a per-invocation basis
    directoryPath: 'NOT_DEFINED',
    folder: Folder.notDefined,
    transient: false
  },
  '.git': {
    directoryPath: '.git',
    folder: Folder.git,
    transient: false
  },
  'node_modules': {
    directoryPath: 'node_modules',
    folder: Folder.node_modules,
    transient: false
  },
  'assets': {
    directoryPath: 'assets',
    folder: Folder.assets,
    transient: false
  },
  'data': {
    directoryPath: 'data',
    folder: Folder.data,
    transient: false
  },
  '.dual-build': {
    directoryPath: '.dual-build',
    folder: Folder.dualBuild,
    transient: false
  },
  '.dual-build/logs': {
    directoryPath: '.dual-build/logs',
    folder: Folder.logs,
    transient: false
  },
  '.dual-build/options': {
    directoryPath: '.dual-build/options',
    folder: Folder.options,
    transient: false
  },
  '.dual-build/packages': {
    directoryPath: '.dual-build/packages',
    folder: Folder.packages,
    transient: false
  },
  '.dual-build/tsconfigs': {
    directoryPath: '.dual-build/tsconfigs',
    folder: Folder.tsconfigs,
    transient: false
  },
  'src': {
    directoryPath: 'src',
    folder: Folder.src,
    transient: false
  },
  'src/bin-command': {
    directoryPath: 'src/bin-command',
    folder: Folder.srcBinCommand,
    transient: false
  },
  'test': {
    directoryPath: 'test',
    folder: Folder.test,
    transient: false
  },
  'bin': {
    directoryPath: 'bin',
    folder: Folder.bin,
    transient: false
  },
  'transient': {
    directoryPath: 'transient',
    folder: Folder.transient,
    transient: true
  },
  'transient/build': {
    directoryPath: 'transient/build',
    folder: Folder.build,
    transient: true
  },
  'transient/build/esm': {
    directoryPath: 'transient/build/esm',
    folder: Folder.buildEsm,
    transient: true
  },
  'transient/build/commonjs': {
    directoryPath: 'transient/build/commonjs',
    folder: Folder.buildCommonJS,
    transient: true
  },
  'transient/publish': {
    directoryPath: 'transient/publish',
    folder: Folder.publish,
    transient: true
  },
  'transient/publish/bin': {
    directoryPath: 'transient/publish/bin',
    folder: Folder.publishBin,
    transient: true
  },
  'transient/publish/esm': {
    directoryPath: 'transient/publish/esm',
    folder: Folder.publishEsm,
    transient: true
  },
  'transient/publish/commonjs': {
    directoryPath: 'transient/publish/commonjs',
    folder: Folder.publishCommonJS,
    transient: true
  },
  'transient/testing': {
    directoryPath: 'transient/testing',
    folder: Folder.testing,
    transient: true
  },
  'transient/testing/esm': {
    directoryPath: 'transient/testing/esm',
    folder: Folder.testingEsm,
    transient: true
  },
  'transient/testing/commonjs': {
    directoryPath: 'transient/testing/commonjs',
    folder: Folder.testingCommonJS,
    transient: true
  }
};

export type ContainsDirectories = {
  directories: Directories;
}

export type ContainsRoot = {
  'root': Directory;
}


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
