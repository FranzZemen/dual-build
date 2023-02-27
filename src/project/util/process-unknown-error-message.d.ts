import { LogInterface } from '../log/log-interface.js';
import { BuildError } from './build-error.js';
export declare function processUnknownError(err: unknown | Error | BuildError | {
    status: string;
    value: any | undefined;
    reason: any | undefined;
}[], log: LogInterface, message?: string): Error;
export declare function processUnknownErrorMessage(err: unknown): string;
