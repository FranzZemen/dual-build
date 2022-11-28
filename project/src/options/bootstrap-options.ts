import {CommonOptions} from './common-options.js';
import {Directories} from './directories.js';
import {BootstrapGitOptions} from './bootstrap-git-options.js';
import {BootstrapPackageOptions} from './bootstrap-package-options.js';
import {Source} from './source.js';

export type BootstrapOptions = {
  saveProfile: boolean,
  git: BootstrapGitOptions,
  package: BootstrapPackageOptions,
  directories: Directories,
  sources: Source[],
  gitIgnore: string[]
}

export type BootstrapOptionsInternal = BootstrapOptions & CommonOptions;
