import {Package, Version} from './package.js';

export enum PackageManager {
  npm = 'npm',
  pnpm = 'pnpm',
  yarn = 'yarn'
}

export type NpxCommandType = 'npx' | 'pnpm dlx' | 'yarn dlx';


export type NpxCommands = {
  [key in PackageManager]: NpxCommandType
}

export const npxCommands : NpxCommands = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'yarn dlx'
}

export const packageJson = 'package.old.json';

type PackageFields = 'description' | 'license' | 'author';

export type PackageOptions = Pick<Package, PackageFields> &  {
  'package manager'?: PackageManager | undefined;
  'initial version'?: Version | undefined;
}
export const packageOptions: PackageOptions = {
  'package manager': PackageManager.npm,
  author: undefined,
  description: undefined,
  'initial version': '0.0.1',
  license: 'MIT'
};
