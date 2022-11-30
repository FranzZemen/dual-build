import {Stream, Duplex, Writable, Readable, Transform} from 'stream';
import {isPromise} from 'util/types';
import {isStream} from 'is-stream';
import {
  DuplexStreamTaskOptions,
  ReadableStreamTaskOptions,
  StreamTaskOptions, TransformStreamTaskOptions,
  WriteableStreamTaskOptions
} from '../options/task/stream-task-options.js';
import {TaskOptions} from '../options/task/task-options.js';
import {Logger} from '../util/logger.js';


type Not<T, R> = R extends T ? never : R;
type NotStreamOrPromise<R> = Not<Stream, R> & Not<Promise<R>, R>

export type TaskFunction<T extends TaskOptions, R> = (options: T, buildProgress?: Logger) => R;

/**
 * Strongly encourage the use of StreamTaskFunctions
 */
export type StreamTaskFunction<T extends StreamTaskOptions, R extends Stream> = TaskFunction<T, R>;

export type WriteableTaskFunction<T extends WriteableStreamTaskOptions, R extends Writable> = StreamTaskFunction<T, R>;
export type ReadableTaskFunction<T extends ReadableStreamTaskOptions, R extends Readable> = StreamTaskFunction<T, R>;
export type DuplexTaskFunction<T extends DuplexStreamTaskOptions, R extends Duplex> = StreamTaskFunction<T, R>;
export type TransformTaskFunction<T extends TransformStreamTaskOptions, R extends Transform> = StreamTaskFunction<T, R>;

/**
 * Although StreamTaskFunctions are encouraged, PromiseTaskFunction is also possible.
 */
export type PromiseTaskFunction<T extends TaskOptions, R> = TaskFunction<T, Promise<R>>;
/**
 * Lease recommended is AnyTaskFunction, which never results in Promise or Stream
 */
export type AnyTaskFunction<T extends TaskOptions> = TaskFunction<T, NotStreamOrPromise<any>>;

/* -----------
   Type Guards
   ----------- */

// Leverage is-stream for stream type guards and isPromise for Promise type guards, and of course any object specific guards for any

export function isNotPromiseAndNotStreamAny(item: Stream | Promise<any> | NotStreamOrPromise<any>): item is NotStreamOrPromise<any> {
  return !(isStream(item) || isPromise(item));
}

