import {licenseIds} from '../util/license-ids.cjs';
import {Version} from '../util/semver.js';


export enum PackageManager {
  npm  = 'npm',
  pnpm = 'pnpm',
  yarn = 'yarn'
}

export type NpxCommandType = 'npx' | 'pnpm dlx' | 'yarn dlx';


export type NpxCommands = {
  [key in PackageManager]: NpxCommandType
}

export const npxCommands: NpxCommands = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'yarn dlx'
};



export enum ModuleType {
  module   = 'module',
  commonjs = 'commonjs'
}

export type Script = string;

export type Scripts = {
  [key: string]: Script
}

export type Binary = string;

export type Binaries = {
  [key: string]: Binary
}


export type ConditionalExportKeys =
  'require'
  | 'import'
  | 'node'
  | 'node-addons'
  | 'default'
  | 'types'
  | 'browser'
  | 'react-native'
  | 'development'
  | 'production'
  | 'deno';

export type PackageSubPath = '.' | `./${string}`;
export type ConditionalExports = { [key in ConditionalExportKeys]?: PackageSubPath};
export type ConditionalSubPathExports = {
  [key in PackageSubPath]?: {
    [key in ConditionalExportKeys]?: PackageSubPath | ConditionalExports
  };
};
export type Exports = PackageSubPath | ConditionalExports | ConditionalSubPathExports;

export type ImportsKey = `#${string}`;
export type ImportsSubPath = `./${string}` | string | ConditionalExportKeys;
export type ConditionalSubPathImports = {[key: ImportsKey]: { [key in ConditionalExportKeys]?: ImportsSubPath | ConditionalExports }};
export type Imports = { [key: ImportsKey]: ImportsSubPath } | ConditionalSubPathImports;

export type Main = PackageSubPath;

export type CommonPublicDomainLicenseIds = 'PD' | 'CCO';
export type CommonPermissiveLicenseIds = 'MIT' | 'Apache' | 'MPL';
export type CommonCopyLeftLicenseIds = 'GPL' | 'AGPL';
export type CommonNonCommercialLicenseIds = 'JRL' | 'AFPL';
export type Unlicensed = 'UNLICENSED' | `SEE LICENSE IN ${string}`;

export type License =
  CommonPublicDomainLicenseIds
  | CommonPermissiveLicenseIds
  | CommonCopyLeftLicenseIds
  | CommonNonCommercialLicenseIds
  | Unlicensed
  | string;  // SPDX


export type Dependencies = {
  [key: string]: string;
}

// Note, incomplete even for NPM, but we'll add as needed.
export type Package = {
  name?: string;
  description?: string;
  version?: Version;
  type?: ModuleType;
  scripts?: Scripts,
  bin?: Binaries,
  main?: Main;
  types?: `./${string}`;
  exports?: Exports;
  imports?: Imports;
  license?: License;
  author?: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  [key: string]: any
}

export const defaultProjectPackage: Package = {
  name: '%{Package Name}',
  description: '%{Description}',
  version: '0.0.1',
  type: ModuleType.module,
  scripts: {},
  bin: {},
  main: './index.js',
  types: './types',
  exports: {},
  imports: {},
  license: licenseIds.indexOf('MIT') >= 0 ? 'MIT' : 'UNLICENSED',
  author: '%{Author}',
};

export const defaultExports: Package = {
  exports: {
    '.': {
      'types': './types',
      'require': './cjs/index.js',
      'import': './esm/index.js'
    }
  }
}

export const defaultDistPackage: Package = {...defaultProjectPackage, ...{defaultExports}};

export const distEsmPackage: Package = {
  type: ModuleType.module
}

export const distCjsPackage: Package = {
  type: ModuleType.commonjs
}



export type BootstrapPackageOptions = {
  author?: string,
  description?: string,
  license?: string, // Replace with list of licenses
  'package manager'?: PackageManager | undefined;
  'initial version'?: Version | undefined;
}

export const defaultBootstrapPackageOptions: BootstrapPackageOptions = {
  'package manager': PackageManager.npm,
  'initial version': '0.0.1'
};




