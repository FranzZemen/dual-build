import {PackageManager} from './package-manager.js';

export enum ModuleType {
  commonjs = 'commonjs',
  module = 'module'
}

export type BootstrapPackageOptions = {
  packageManager: PackageManager;
  author: string,
  type: ModuleType,
  initialVersion: string,
  description: string,
  license: string
}
