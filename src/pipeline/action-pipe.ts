import {Action} from '../action/action.js';
import {NestedLog} from '../log/nested-log.js';
import {ExecutionResult, FulfilledStatus, RejectedStatus, Settled, SettledStatus} from './pipeline.js';

export type ActionType = 'action';
export type ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ActionType, S>;

export class ActionPipe<PAYLOAD_IN, PAYLOAD_OUT> {
  protected constructor(protected _action: Action<PAYLOAD_IN, PAYLOAD_OUT>) {
  }

  static action<ACTION_IN, ACTION_OUT>(action: Action<ACTION_IN, ACTION_OUT>): ActionPipe<ACTION_IN, ACTION_OUT> {
    return new ActionPipe<ACTION_IN, ACTION_OUT>(action);
  }

  get actionName(): string {
    if (this._action) {
      return this._action.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(payload: PAYLOAD_IN): Promise<ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SettledStatus>> {
    const actionName = this.actionName;
    try {
      return Promise.resolve({
        scope: 'action',
        actionName,
        input: payload,
        log: 'this',
        output: await this._action.execute(payload),
        settled: {status: 'fulfilled'} as Settled<FulfilledStatus>
      });
    } catch (err) {
      console.error(err);
      return Promise.reject({
        scope: 'action',
        actionName,
        input: payload,
        log: 'this',
        output: 'error',
        settled: {status: 'rejected', reason: err} as Settled<RejectedStatus>
      });
    }
  }
}
