/*
Created by Franz Zemen 02/06/2023
License Type: MIT
*/

import {ChildProcess, exec, execFile, execFileSync, execSync} from 'node:child_process';
import * as process from 'node:process';
import {LogTreatmentName} from '../../log/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {isExecSyncErrorThenStringifyBuffers} from '../../util/exec-sync-error.js';
import {TransformPayload, TransformPayloadOut} from '../../transform/index.js';
import {Transform} from '../../transform/index.js';



export type ExecutablePayload = {
  cwd?: string;
  executable: string; // Executable or filename depending on batch
  arguments: ExecArguments;
  batchTarget: boolean;
  synchronous: boolean;
  stdioTreatment?: LogTreatmentName;
  stderrTreatment?: LogTreatmentName;
}

// export type ExexcutableTransformConstructor<CLASS extends Transform<ExecutableTransform, any, any>> = new (logDepth: number) => CLASS;


/**
 * The payload is either passed in or piped in, depending on which one extends/is ExecutablePayload
 */

NEED TO MOVE PAYLOAD TO CONCRETE CLASS AND ALLOW SUB CLASSES TO PASS EXEC STUFF
export abstract class AbstractExecutableTransform<OUT = void> extends TransformPayloadOut<ExecutablePayload, OUT> {

  protected constructor(depth: number) {
    super(depth);
  }
  private processAsyncError(error: Error | null, stdout:string, stderr: string, stdioTreatment: LogTreatmentName = 'context', stderrTreatment: LogTreatmentName = 'context'): void | BuildError {
    if(stdout) {
      this.contextLog.infoSegments([{data: stdout, treatment: stdioTreatment}]);
    }
    if(stderr) {
      this.contextLog.infoSegments([{data: stderr, treatment: stderrTreatment}]);
    }
    if(error) {
      const buildError = new BuildError('exec error', {cause: error}, BuildErrorNumber.AsyncExecError);
      this.contextLog.error(buildError);
      return buildError;
    }
  }

  protected executeImplPayloadOut(payload: ExecutablePayload): Promise<OUT> {
    return new Promise<OUT>((resolve, reject) => {
      if (!payload) {
        throw new BuildError('No executable payload', undefined, BuildErrorNumber.NoExecutablePayload);
      }
      // @ts-ignore
      const cwd = payload.cwd ?? process.cwd();
      let command = payload.executable;
      let args: string = '';
      payload.arguments.forEach(argument => {
        args += ` ${argument}`;
      });
      if (payload.batchTarget) {
        if (payload.synchronous) {
          const result = execFileSync(command, payload.arguments, {cwd, windowsHide: false})
          this.contextLog.info(result.toString('utf-8'), 'context');
          resolve(this.resolution(result));
        } else {
          const childProcess: ChildProcess = execFile(command, payload.arguments, {cwd, windowsHide: false}, (error, stdout, stderr) => {
            const buildError: BuildError | void = this.processAsyncError(error, stdout, stderr, payload.stdioTreatment, payload.stderrTreatment);
            if(buildError) {
              reject(buildError);
            } else {
              resolve(this.resolution(undefined));
            }
          });
        }
      } else {
        command += args;
        if (payload.synchronous) {
          try {
            const result = execSync(command);
            this.contextLog.info(result.toString('utf-8'), 'context');
            resolve(this.resolution(result));
          } catch (err) {
            // Because we used stdio:'inherit' everything's already printed, and we just need to set "this" process error
            if(isExecSyncErrorThenStringifyBuffers(err)) {

              const error = new BuildError(err.message, {cause: err}, BuildErrorNumber.SyncExecError);
              this.contextLog.error(error);
              return reject(error);
            } else {
              const error = new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
              this.contextLog.error(error);
              return reject(error);
            }
          }
        } else {
          const childProcess: ChildProcess = exec(command, {cwd, windowsHide: false}, (error, stdout, stderr) => {
            const buildError: BuildError | void = this.processAsyncError(error, stdout, stderr, payload.stdioTreatment, payload.stderrTreatment);
            if(buildError) {
              reject(buildError);
            } else {
              resolve(this.resolution(undefined));
            }
          });
        }
      }
    });
  }

  protected abstract resolution(result: Buffer | undefined): Promise<OUT>;

  protected transformContext(pipeIn: any, payload: ExecutablePayload): string | object {
    return payload;
  }
}

export class ExecutableTransform extends AbstractExecutableTransform<void> {
  constructor(depth: number) {
    super(depth);
  }

  protected resolution(result: Buffer | undefined): Promise<void> {
    return Promise.resolve();
  }
}
