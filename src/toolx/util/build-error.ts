/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/

export class BuildError extends Error {

  public  constructor (message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
