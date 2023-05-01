/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/


import {Pipeline} from './pipeline.js';

export interface Pipe<PIPED_IN, OUTPUT> {
  execute(payload: PIPED_IN): Promise<OUTPUT>;
  copy(pipeline: Pipeline<any, any>): Pipe<PIPED_IN, OUTPUT>;
}

export type AnyPipe = Pipe<any,any>;

// export type Pipe = TransformPipe<any, any, any> | SeriesPipe<any, any> | ParallelPipe<any, any>;
