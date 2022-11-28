import {defaultDirectories} from './default-directories.js';

export const defaultGitIgnore: string[] = [
  'node_modules',
  defaultDirectories.build,
  defaultDirectories.publish,
  'testing*',
  '.zip',
  '.idea'
  ]
