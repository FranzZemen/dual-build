import {BootstrapOptions} from '../options/bootstrap-options.js';
import {defaultBootstrapGitOptions} from './default-bootstrap-git-options.js';
import {defaultBootstrapPackageOptions} from './default-bootstrap-package-options.js';
import {defaultDirectories} from './default-directories.js';
import {defaultGitIgnore} from './default-gitignore.js';
import {defaultSources} from './default-sources.js';

export const defaultBootstrapOptions: BootstrapOptions = {
  saveProfile: true,
  git: defaultBootstrapGitOptions,
  package: defaultBootstrapPackageOptions,
  directories: defaultDirectories,
  sources: defaultSources,
  gitIgnore: defaultGitIgnore
}
