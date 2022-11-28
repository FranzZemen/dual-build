import {basename} from 'node:path';
import {cwd} from 'node:process';
import {BootstrapGitOptions} from '../options/bootstrap-git-options.js';


export const defaultBootstrapGitOptions: BootstrapGitOptions = {
  useGit: true,
  username: undefined,
  repository: basename(cwd()),
  initGit: true,
  addOrigin: true,
  add: true,
  commit: true,
  push: true
}
