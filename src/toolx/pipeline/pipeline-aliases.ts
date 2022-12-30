/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {ActionPipe} from './action-pipe.js';
import {ParallelPipe} from './parallel-pipe.js';
import {SeriesPipe} from './series-pipe.js';

export type DefaultPayload = Map<string, any>;

export type PipelineOptions<PIPELINE_IN = any> = {
  name: string;
  logDepth: number;
  payload?: PIPELINE_IN
}

