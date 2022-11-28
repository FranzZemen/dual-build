import {BootstrapPackageOptions, ModuleType} from '../options/bootstrap-package-options.js';
import {PackageManager} from '../options/package-manager.js';

export const defaultPackageManager: PackageManager = PackageManager.npm;

export const defaultBootstrapPackageOptions: BootstrapPackageOptions = {
  packageManager: defaultPackageManager,
  type: ModuleType.module,
  author: undefined,
  description: undefined,
  initialVersion: '0.0.1.pre-alpha',
  license: 'MIT'
}

