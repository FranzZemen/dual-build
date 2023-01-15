import {basename, join} from 'node:path';
import {cwd} from 'node:process';
import {directories} from './directories.js';
import {packageJson} from './package.options.js';

export enum GitProtocol  {
  https = 'https://github.com/',
  git   = 'git@github.com:',
  ssh   = 'ssh://git@github.com/'
}

export type GitOptions = {
  useGit: boolean;
  username?: string;
  repository: string | (() => string);
  protocol?: GitProtocol;
  'git init'?: boolean;
  'git remote add origin'?: boolean;
  'git push current branch on successful build'?: boolean;
  'git push current branch on successful publish'?: boolean;
}

export type ContainsGitOptions = {
  gitOptions: GitOptions;
}

export const gitOptions: GitOptions = {
  useGit: true,
  repository: () => basename(cwd()),
  protocol: GitProtocol.https,
  'git init': true,
  'git remote add origin': true,
  'git push current branch on successful build': true,
  'git push current branch on successful publish': true
};

export const gitignore: string[] = [
  directories.node_modules.directoryPath,
  directories.bin.directoryPath,
  directories.transient.directoryPath,
  directories['.dual-build/logs'].directoryPath,
  join(directories.src.directoryPath, packageJson),
  join(directories.test.directoryPath, packageJson),
  '.zip',
  '.idea'
];
