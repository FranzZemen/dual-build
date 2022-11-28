import {TaskOptions} from './task-options.js';

export type StreamTaskOptions = TaskOptions &  {
}

export type ReadableStreamTaskOptions = StreamTaskOptions & {

}

export type WriteableStreamTaskOptions = StreamTaskOptions & {

}

export type DuplexStreamTaskOptions = ReadableStreamTaskOptions & WriteableStreamTaskOptions & {

}

export type TransformStreamTaskOptions = DuplexStreamTaskOptions & {

}
