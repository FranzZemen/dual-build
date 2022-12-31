/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {Action, ActionConstructor} from '../action/action.js';
import {ActionPipe} from './action-pipe.js';
import {ParallelPipe} from './parallel-pipe.js';
import {SeriesPipe} from './series-pipe.js';

export type DefaultPayload = Map<string, any>;


export type PipelineOptions = {
  name: string;
  logDepth: number;
}

