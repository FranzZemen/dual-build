/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {ParallelPipe} from './parallel-pipe.js';
import {SeriesPipe} from './series-pipe.js';
import {TransformPipe} from './transform-pipe.js';


export type PipelineOptions = {
  name: string;
  logDepth: number;
}

export type Pipe = TransformPipe<any, any, any> | SeriesPipe<any, any> | ParallelPipe<any, any>;
