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
  autogenerated: boolean;
};

export type Directories = {
  [key in DirectoryPath | 'root']: Directory;
};




export const directories: Directories = {
  'root': {
    // This is set on a per-invocation basis
    directoryPath: 'NOT_DEFINED',
    folder: Folder.notDefined,
    transient: false,
    autogenerated: false,
  },
  '.git': {
    directoryPath: './.git',
    folder: Folder.git,
    transient: false,
    autogenerated:true
  },
  'node_modules': {
    directoryPath: './node_modules',
    folder: Folder.node_modules,
    transient: false,
    autogenerated:true
  },
  'assets': {
    directoryPath: './assets',
    folder: Folder.assets,
    transient: false,
    autogenerated:false
  },
  'data': {
    directoryPath: './data',
    folder: Folder.data,
    transient: false,
    autogenerated:false
  },
  '.dual-build': {
    directoryPath: './.dual-build',
    folder: Folder.dualBuild,
    transient: false,
    autogenerated:false
  },
  '.dual-build/logs': {
    directoryPath: './.dual-build/logs',
    folder: Folder.logs,
    transient: false,
    autogenerated:false
  },
  '.dual-build/options': {
    directoryPath: './.dual-build/options',
    folder: Folder.options,
    transient: false,
    autogenerated:false
  },
  '.dual-build/packages': {
    directoryPath: './.dual-build/packages',
    folder: Folder.packages,
    transient: false,
    autogenerated:false
  },
  '.dual-build/tsconfigs': {
    directoryPath: './.dual-build/tsconfigs',
    folder: Folder.tsconfigs,
    transient: false,
    autogenerated:false
  },
  'src': {
    directoryPath: './src',
    folder: Folder.src,
    transient: false,
    autogenerated:false
  },
  'src/bin-command': {
    directoryPath: './src/bin-command',
    folder: Folder.srcBinCommand,
    transient: false,
    autogenerated:false
  },
  'test': {
    directoryPath: './test',
    folder: Folder.test,
    transient: false,
    autogenerated:false
  },
  'bin': {
    directoryPath: './bin',
    folder: Folder.bin,
    transient: false,
    autogenerated:false
  },
  'transient': {
    directoryPath: './transient',
    folder: Folder.transient,
    transient: true,
    autogenerated:true
  },
  'transient/build': {
    directoryPath: './transient/build',
    folder: Folder.build,
    transient: true,
    autogenerated:true
  },
  'transient/build/esm': {
    directoryPath: './transient/build/esm',
    folder: Folder.buildEsm,
    transient: true,
    autogenerated:true
  },
  'transient/build/commonjs': {
    directoryPath: './transient/build/commonjs',
    folder: Folder.buildCommonJS,
    transient: true,
    autogenerated:true
  },
  'transient/publish': {
    directoryPath: './transient/publish',
    folder: Folder.publish,
    transient: true,
    autogenerated:true
  },
  'transient/publish/bin': {
    directoryPath: './transient/publish/bin',
    folder: Folder.publishBin,
    transient: true,
    autogenerated:true
  },
  'transient/publish/esm': {
    directoryPath: './transient/publish/esm',
    folder: Folder.publishEsm,
    transient: true,
    autogenerated:true
  },
  'transient/publish/commonjs': {
    directoryPath: './transient/publish/commonjs',
    folder: Folder.publishCommonJS,
    transient: true,
    autogenerated:true
  },
  'transient/testing': {
    directoryPath: './transient/testing',
    folder: Folder.testing,
    transient: true,
    autogenerated:true
  },
  'transient/testing/esm': {
    directoryPath: './transient/testing/esm',
    folder: Folder.testingEsm,
    transient: true,
    autogenerated:true
  },
  'transient/testing/commonjs': {
    directoryPath: './transient/testing/commonjs',
    folder: Folder.testingCommonJS,
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