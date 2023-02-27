/*
Created by Franz Zemen 02/06/2023
License Type: MIT
*/
import { exec, execSync, execFile, execFileSync } from 'node:child_process';
import * as process from 'node:process';
import { BuildError, BuildErrorNumber } from '../../util/build-error.js';
import { TransformPayload } from '../transform-payload.js';
export function isDoubleDashFlag(flag) {
    return flag.startsWith('--');
}
export function isDashFlag(flag) {
    return !isDoubleDashFlag(flag) && flag.startsWith('-');
}
export function isKeyValuePair(kvp) {
    return /^[a-zA-Z0-9]+(?:=|\u0020=\u0020|\u0020|\u0020{2})[a-zA-Z0-9]+/.test(kvp);
}
/**
 * The payload is either passed in or piped in, depending on which one extends/is ExecutablePayload
 */
export class ExecutableTransform extends TransformPayload {
    constructor(depth) {
        super(depth);
    }
    executeImplPayload(payload) {
        return new Promise((resolve, reject) => {
            if (!payload) {
                throw new BuildError('No executable payload', undefined, BuildErrorNumber.NoExecutablePayload);
            }
            // @ts-ignore
            const cwd = payload.cwd ?? process.cwd();
            let command = payload.executable;
            let args = '';
            payload.arguments.forEach(argument => {
                args += ` ${argument}`;
            });
            if (payload.batchTarget) {
                if (payload.synchronous) {
                    this.log.info(execFileSync(command, payload.arguments, { cwd, windowsHide: false }));
                }
                else {
                    const childProcess = execFile(command, payload.arguments, { cwd, windowsHide: false }, (error, stdout, stderr) => {
                        const buildError = this.processAsyncError(error, stdout, stderr);
                        if (buildError) {
                            reject(buildError);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            }
            else {
                command += args;
                if (payload.synchronous) {
                    try {
                        this.log.info(execSync(command, { cwd, windowsHide: false }));
                        resolve();
                    }
                    catch (err) {
                        const buildError = new BuildError('execSync error', { cause: err }, BuildErrorNumber.SyncExecError);
                        this.log.error(buildError);
                        reject(buildError);
                    }
                }
                else {
                    const childProcess = exec(command, { cwd, windowsHide: false }, (error, stdout, stderr) => {
                        const buildError = this.processAsyncError(error, stdout, stderr);
                        if (buildError) {
                            reject(buildError);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            }
        });
    }
    processAsyncError(error, stdout, stderr) {
        if (stdout) {
            this.log.info(stdout);
        }
        if (stderr) {
            this.log.error(stderr);
        }
        if (error) {
            const buildError = new BuildError('exec error', { cause: error }, BuildErrorNumber.AsyncExecError);
            this.log.error(buildError);
            return buildError;
        }
    }
    transformContext(pipeIn, payload) {
        let args = '';
        payload.arguments.forEach(argument => {
            args += ` ${argument}`;
        });
        return `${payload.synchronous ? 'synchronous' : 'synchronous'} ${payload.batchTarget ? 'batch' : 'execution'} ${payload.executable} ${args}`;
    }
}
