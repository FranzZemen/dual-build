/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {TransformIn, TransformInConstructor} from '../transform/transform-in.js';
import {TransformIndependent, TransformIndependentConstructor} from '../transform/transform-independent.js';
import {TransformOut, TransformOutConstructor} from '../transform/transform-out.js';
import {TransformPayloadOut, TransformPayloadOutConstructor} from '../transform/transform-payload-out.js';
import {TransformPayload, TransformPayloadConstructor} from '../transform/transform-payload.js';
import {Transform, TransformConstructor} from '../transform/transform.js';
import {ParallelPipe} from './parallel-pipe.js';
import {SeriesPipe} from './series-pipe.js';
import {TransformPipe} from './transform-pipe.js';

export type DefaultPayload = Map<string, any>;


export type PipelineOptions = {
  name: string;
  logDepth: number;
}

export type Pipe = TransformPipe<any, any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any>;
