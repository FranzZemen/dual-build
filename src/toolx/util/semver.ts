/*
Created by Franz Zemen 02/08/2023
License Type: 
*/


import {BuildError, BuildErrorNumber} from './build-error.js';

export type Version = `${number}.${number}.${number}`;

export type VersionIncrement = 'major' | 'minor' | 'patch';

export type Semver = [major: `${number}`, minor: `${number}`, patch: `${number}`];

export function isSemver(arr: string[] | Semver): arr is Semver {
  return arr.length === 3 && arr.every(str => !isNaN(parseInt(str, 10)));
}

export function neverSwitch(value: never):any {
  throw new Error('Unreachable code');
}

export function increment(version: Version, intent: VersionIncrement): Version {
  const semver: string[] = version.split('.');
  if(isSemver(semver)) {
    switch(intent) {
      case 'major':
        const nextMajor = parseInt(semver[0], 10) + 1;
        return `${nextMajor}.${semver[1]}.${semver[2]}`
      case 'minor':
        const nextMinor = parseInt(semver[1], 10) + 1;
        return `${semver[0]}.${nextMinor}.${semver[2]}`
      case 'patch':
        const nextPatch = parseInt(semver[2], 10) + 1;
        return `${semver[0]}.${semver[1]}.${nextPatch}`
      default:
        return neverSwitch(intent);

    }
  } else {
    throw new BuildError('Version is not Semver', undefined, BuildErrorNumber.VersionIsNotSemver);
  }
}

