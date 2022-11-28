import {Options as FastGlobOptions} from 'fast-glob';
import {ReadableStreamTaskOptions, StreamTaskOptions} from './stream-task-options.js';

export type GlobTaskOptions = ReadableStreamTaskOptions & FastGlobOptions & {
  pattern: string | string[],
  objectMode: true
}
