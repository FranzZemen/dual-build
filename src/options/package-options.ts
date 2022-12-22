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


export type PackageOptions = {
  author?: string,
  description?: string,
  license?: string, // Replace with list of licenses
  'package manager'?: PackageManager | undefined;
  'initial version'?: Version | undefined;
}
export const packageOptions: PackageOptions = {
  'package manager': PackageManager.npm,
  'initial version': '0.0.1',
};
