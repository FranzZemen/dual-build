/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/

export enum BuildErrorNumber {
  DirectoryAlreadyExists = 'Error 1: Directory Already Exists'
}

export class BuildError extends Error {

  public  constructor (message?: string, options?: ErrorOptions, public readonly errorNumber?: BuildErrorNumber) {
    super(message, options);
  }
}
