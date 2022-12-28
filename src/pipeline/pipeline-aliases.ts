/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {ActionPipe, ActionPipeExecutionResult, ActionType} from './action-pipe.js';
import {ParallelPipe} from './parallel-pipe.js';
import {SeriesPipe} from './series-pipe.js';



export type SeriesType = 'series';
export type ParallelType = 'parallel';




export type DefaultPayload = Map<string, any>;



export type FulfilledStatus = 'fulfilled';
export type RejectedStatus = 'rejected';
export type SettledStatus = FulfilledStatus | RejectedStatus;

export type Settled<T extends SettledStatus> = {
  status: T;
} & (T extends FulfilledStatus ? {} : T extends RejectedStatus ? { reason: any } : never);


export type PipeType = ActionType | SeriesType | ParallelType;

export type NarrowedPipeType<T extends PipeType> = T extends ActionType ? ActionType : T extends SeriesType ? SeriesType : T extends ParallelType ? ParallelType : never;
export type NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = T extends ActionType ? 'this' : T extends SeriesType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : T extends ParallelType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : never;
export type ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = { scope: NarrowedPipeType<T>, actionName: string, log: NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T, S>, input: PAYLOAD_IN, output: PAYLOAD_OUT, settled: Settled<S> };

export type SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SeriesType, S>;
export type ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ParallelType, S>;8

export function isExecutionResult(result: any | ExecutionResult<any, any, any, any>): result is ExecutionResult<any, any, any, any> {
  return 'scope' in result;
}

export function isSettledRejected(settled: Settled<'fulfilled'> | Settled<'rejected'>): settled is Settled<'rejected'> {
  return settled.status === 'rejected';
}

export type TransformFunction<TRANSFORM_IN, TRANSFORM_OUT> = (transformIn: TRANSFORM_IN ) => TRANSFORM_OUT;


export type Pipe = ActionPipe<any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any> | TransformFunction<any, any>;

export type PipelineOptions<PIPELINE_IN = any> = {
  name: string;
  logDepth: number;
  payload?: PIPELINE_IN
}




export interface SeriesStarted {

}
