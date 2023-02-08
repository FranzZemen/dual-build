/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/

export enum BuildErrorNumber {
  DirectoryAlreadyExists = 'Error 1: Directory Already Exists',
  // Child Process Errors
  NoExecutablePayload = 'Error 500: No payload provided for ExecutableTransform',
  AsyncExecError = 'Error 501: Asynchronous executable errored out',
  SyncExecError = 'Error 502: Synchronous executable errored out',
  // Miscellaneous
  VersionIsNotSemver = 'Error 5000: Version string does not represent a semver'
}

export class BuildError extends Error {

  public  constructor (message?: string, options?: ErrorOptions, public readonly errorNumber?: BuildErrorNumber) {
    super(message, options);
  }
}
