import {Readable} from 'node:stream';
import fg from 'fast-glob';
import {GlobTaskOptions} from '../../options/task/glob-task-options.js';
import {ReadableStreamTaskOptions} from '../../options/task/stream-task-options.js';
import {Logger} from '../../util/logger.js';
import {ReadableTaskFunction} from '../task-function.js';
import {Task} from '../task.js';

export type GlobTask = Task<GlobTaskOptions, Readable>;

export const globTaskFunction: ReadableTaskFunction<GlobTaskOptions, Readable> = (options: GlobTaskOptions,buildProgress: Logger) => {
  return new Readable().wrap(fg.stream(options.pattern,{objectMode: options.objectMode}));
}

export const glob: GlobTask = {
  name:'glob',
  native: true,
  taskFunction: globTaskFunction
}
