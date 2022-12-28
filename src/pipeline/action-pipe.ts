import {Action, ActionConstructor} from '../action/action.js';
import {ExecutionResult, FulfilledStatus, RejectedStatus, Settled, SettledStatus} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';

export type ActionType = 'action';
export type ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ActionType, S>;

export class ActionPipe<ACTION_IN, ACTION_OUT> {
  protected constructor(protected _action: Action<ACTION_IN, ACTION_OUT>, protected _pipeline: Pipeline<any, any>) {
  }

  static action<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>, pipeline: Pipeline<any, any>): ActionPipe<ACTION_IN, ACTION_OUT> {
    // ----- Declaration separator ----- //
    return new ActionPipe<ACTION_IN, ACTION_OUT>(new actionClass(pipeline.logDepth + 1), pipeline);
  }

  get actionName(): string {
    if (this._action) {
      return this._action.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(payload: ACTION_IN): Promise<ACTION_OUT> {
    const actionName = this.actionName;
    try {
      return await this._action.execute(payload);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
