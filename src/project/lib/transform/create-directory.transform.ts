/*
Created by Franz Zemen 2/3/2023
License Type: MIT
*/


import {access} from 'fs/promises';
import {mkdir} from 'node:fs/promises';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../../transform/index.js';


/**
 * Payload for CreateDirectoryTransform
 * @property directory - the directory to create.  If relative, will be created in process.cwd.
 * @property errorOnExists - if true, an error is thrown if the directory already exists.  If false, the directory is not created and a warning is logged.
 */
export type CreateDirectoryPayload = {
  directory: string,
  errorOnExists: boolean
};

/**
 * Creates a directory asynchronously.  The piped in object is the root name or undefined.  If undefined, the path (relative or absolute) contained
 * in the Directory payload is used. If defined, that path is joined to the root path.
 */
export class CreateDirectoryTransform extends TransformPayload<CreateDirectoryPayload> {
  constructor(logDepth: number) {
    super(logDepth);
  }


  protected executeImplPayload(payload: CreateDirectoryPayload): Promise<void> {
    return access(payload.directory)
      .then(() => {
        if (paylaod.errorOnExists) {
          throw new BuildError(
            `Directory ${payload.directory} already exists and rules = 'error on exist'`,
            undefined, BuildErrorNumber.DirectoryAlreadyExists);
        } else {
          const msg = `Project folder ${payload.directory} already exists, skipping`;
          this.contextLog.warn(msg);
          return;
        }
      })
      .catch((err: unknown) => {
        if (err instanceof BuildError) {
          throw err;
        } else {
          return mkdir(payload.directory, {recursive: true})
            .then(() => {
              this.contextLog.info(`created ${payload.directory}`, 'task-internal');
              return;
            })
        }
      })
  }



  protected transformContext(pipeIn: undefined,
                             payload: CreateDirectoryPayload | undefined): string | object | Promise<string | object> {
    return payload.directory;
  }
}
