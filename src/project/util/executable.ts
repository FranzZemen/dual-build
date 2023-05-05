/*
Created by Franz Zemen 05/01/2023
License Type: MIT
*/

import {ChildProcess, exec, execFile, execFileSync, execSync} from 'node:child_process';
import process from 'node:process';
import {Log, LogTreatmentName} from '../log/index.js';
import {BuildError, BuildErrorNumber} from './build-error.js';
import {isExecSyncErrorThenStringifyBuffers} from './exec-sync-error.js';

export type ArgumentDashFlag = `-${string}`;
export type ArgumentDoubleDashFlag = `--${string}`;
export type ArgumentKey = string | ArgumentDashFlag | ArgumentDoubleDashFlag;
export type ArgumentValue = string;
export type ArgumentKeyValueSeparator = `=` | ` = ` | ` ` | `  `;
export type ArgumentKeyValuePair = `${ArgumentKey}${ArgumentKeyValueSeparator}${ArgumentValue}`;
export type ExecutableArguments = (ArgumentDoubleDashFlag | ArgumentDashFlag | ArgumentValue | ArgumentKeyValuePair)[];

export function isDoubleDashFlag(flag: string | ArgumentDoubleDashFlag): flag is ArgumentDoubleDashFlag {
  return flag.startsWith('--');
}

export function isDashFlag(flag: string | ArgumentDashFlag): flag is ArgumentDashFlag {
  return !isDoubleDashFlag(flag) && flag.startsWith('-');
}

export function isKeyValuePair(kvp: string | ArgumentKeyValuePair): kvp is ArgumentKeyValuePair {
  return /^[a-zA-Z0-9]+(?:=|\u0020=\u0020|\u0020|\u0020{2})[a-zA-Z0-9]+/.test(kvp);
}


export type ExecutablePayload = {
  // Current working directory if different from process.cwd()
  cwd?: string;
  // Executable or filename depending on batch
  executable: string;
  // Executable arguments
  arguments: ExecutableArguments;
  // If true, the executable is a batch file
  batchTarget: boolean;
  synchronous: boolean;
  stdioTreatment?: LogTreatmentName;
  stderrTreatment?: LogTreatmentName;
}

export type ExecutableResult = [stdout: string, stderr:string | undefined];

export class Executable<PAYLOAD extends ExecutablePayload> {
  protected log: Log;

  public constructor(log?: Log) {
    if (!log) {
      this.log = new Log(0);
    } else {
      this.log = log;
    }
  }

  public exec(payload: PAYLOAD): Promise<ExecutableResult> {
    return new Promise<ExecutableResult>((resolve, reject) => {
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
          const result = execFileSync(command, payload.arguments, {cwd, windowsHide: false});
          this.log.info(result.toString('utf-8'), 'context');
          resolve([result.toString('utf-8'), undefined]);
        } else {
          const childProcess: ChildProcess = execFile(command, payload.arguments, {cwd, windowsHide: false}, (error, stdout, stderr) => {
            const buildError: BuildError | void = this.processAsyncError(error, stdout, stderr, payload.stdioTreatment, payload.stderrTreatment);
            if (buildError) {
              reject(buildError);
            } else {
              resolve([stdout, stderr]);
            }
          });
        }
      } else {
        command += args;
        if (payload.synchronous) {
          try {
            const result = execSync(command);
            this.log.info(result.toString('utf-8'), 'context');
            resolve([result.toString('utf-8'), undefined]);
          } catch (err) {
            // Because we used stdio:'inherit' everything's already printed, and we just need to set "this" process error
            if (isExecSyncErrorThenStringifyBuffers(err)) {
              const error = new BuildError(err.message, {cause: err}, BuildErrorNumber.SyncExecError);
              this.log.error(error);
              return reject(error);
            } else {
              const error = new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
              this.log.error(error);
              return reject(error);
            }
          }
        } else {
          const childProcess: ChildProcess = exec(command, {cwd, windowsHide: false}, (error, stdout, stderr) => {
            const buildError: BuildError | void = this.processAsyncError(error, stdout, stderr, payload.stdioTreatment, payload.stderrTreatment);
            if (buildError) {
              reject(buildError);
            } else {
              resolve([stdout, stderr]);
            }
          });
        }
      }
    });
  }

  private processAsyncError(error: Error | null,
                            stdout: string,
                            stderr: string,
                            stdioTreatment: LogTreatmentName = 'context',
                            stderrTreatment: LogTreatmentName = 'context'): void | BuildError {
    if (stdout) {
      this.log.infoSegments([{data: stdout, treatment: stdioTreatment}]);
    }
    if (stderr) {
      this.log.infoSegments([{data: stderr, treatment: stderrTreatment}]);
    }
    if (error) {
      const buildError = new BuildError('exec error', {cause: error}, BuildErrorNumber.AsyncExecError);
      this.log.error(buildError);
      return buildError;
    }
  }
}
