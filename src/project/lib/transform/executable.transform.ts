/*
Created by Franz Zemen 02/06/2023
License Type: MIT
*/

import {ChildProcess, exec, execFile, execFileSync, execSync} from 'node:child_process';
import * as process from 'node:process';
import {TreatmentName} from '../../log/index.js';
import {BuildError, BuildErrorNumber} from '../../util/build-error.js';
import {isExecSyncErrorThenStringifyBuffers} from '../../util/exec-sync-error.js';
import {TransformPayload} from '../../transform/core/transform-payload.js';
import {Transform} from '../../transform/core/transform.js';

export type DoubleDashFlag = `--${string}`;
export type DashFlag = `-${string}`;
export type Key = string | DashFlag | DoubleDashFlag;
export type Value = string;
export type KeyValueSep = `=` | ` = ` | ` ` | `  `;
export type KeyValuePair = `${Key}${KeyValueSep}${Value}`;
export type ExecArguments = (DoubleDashFlag | DashFlag | Value | KeyValuePair)[];

export function isDoubleDashFlag(flag: string | DoubleDashFlag): flag is DoubleDashFlag {
  return flag.startsWith('--');
}

export function isDashFlag(flag: string | DashFlag): flag is DashFlag {
  return !isDoubleDashFlag(flag) && flag.startsWith('-');
}

export function isKeyValuePair(kvp: string | KeyValuePair): kvp is KeyValuePair {
  return /^[a-zA-Z0-9]+(?:=|\u0020=\u0020|\u0020|\u0020{2})[a-zA-Z0-9]+/.test(kvp);
}


export type ExecutablePayload = {
  cwd?: string;
  executable: string; // Executable or filename depending on batch
  arguments: ExecArguments;
  batchTarget: boolean;
  synchronous: boolean;
  stdioTreatment?: TreatmentName;
  stderrTreatment?: TreatmentName;
}

export type ExexcutableTransformConstructor<CLASS extends Transform<ExecutableTransform, any, any>> = new (logDepth: number) => CLASS;


/**
 * The payload is either passed in or piped in, depending on which one extends/is ExecutablePayload
 */
export class ExecutableTransform extends TransformPayload<ExecutablePayload> {

  constructor(depth: number) {
    super(depth);
  }

  protected executeImplPayload(payload: ExecutablePayload): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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
          resolve();
        } else {
          const childProcess: ChildProcess = execFile(command, payload.arguments, {cwd, windowsHide: false}, (error, stdout, stderr) => {
            const buildError: BuildError | void = this.processAsyncError(error, stdout, stderr, payload.stdioTreatment, payload.stderrTreatment);
            if(buildError) {
              reject(buildError);
            } else {
              resolve();
            }
          });
        }
      } else {
        command += args;
        if (payload.synchronous) {
          try {
            const result = execSync(command);
            this.contextLog.info(result.toString('utf-8'), 'context');
            resolve();
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
              resolve();
            }
          });
        }
      }
    });
  }

  private processAsyncError(error: Error | null, stdout:string, stderr: string, stdioTreatment: TreatmentName = 'context', stderrTreatment: TreatmentName = 'context'): void | BuildError {
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

  protected transformContext(pipeIn: any, payload: ExecutablePayload): string | object {
    return payload;
  }
}