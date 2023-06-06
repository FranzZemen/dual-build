/*
Created by Franz Zemen 12/20/2022
License Type: 
*/

import {resolve} from 'node:path';
import {chdir, cwd} from 'node:process';
import {processUnknownError} from '../../util/index.js';
import {TransformPayloadIn} from '../../transform/index.js';


export class ChangeWorkingDirectory extends TransformPayloadIn<string | undefined, string | undefined> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public transformContext(rootDirectoryPath: string): string {
    return rootDirectoryPath;
  }

  protected executeImplPayloadIn(pipeIn: string | undefined, passedIn: string | undefined): Promise<void> {
    if (pipeIn) {
      return this.changeWorkingDirectory(pipeIn);
    } else if(passedIn) {
      return this.changeWorkingDirectory(passedIn);
    } else {
      throw new Error('Undefined payload');
    }
  }

  private changeWorkingDirectory(rootDirectorPath: string): Promise<void> {
    try {
      const newCwd = rootDirectorPath;
      this.contextLog.info(`current working directory is ${cwd()}`, 'task-internal')
      const newCwdPath = resolve(cwd(), newCwd);
      chdir(newCwdPath);
      this.contextLog.info(`new working directory is ${cwd()}`, 'warn');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(processUnknownError(err, this.contextLog));
    }
  }
}
