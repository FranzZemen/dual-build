export type Version = `${number}.${number}.${number}`;
export type VersionIncrement = 'major' | 'minor' | 'patch';
export type Semver = [major: `${number}`, minor: `${number}`, patch: `${number}`];
export declare function isSemver(arr: string[] | Semver): arr is Semver;
export declare function neverSwitch(value: never): any;
export declare function increment(version: Version, intent: VersionIncrement): Version;
