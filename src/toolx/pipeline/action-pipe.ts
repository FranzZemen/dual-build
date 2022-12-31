import {Action, ActionConstructor} from '../action/action.js';
import {Pipeline} from './pipeline.js';

export class ActionPipe<PAYLOAD, ACTION_IN, ACTION_OUT> {
  protected payloadOverride: PAYLOAD | undefined;
  protected constructor(protected _action: Action<PAYLOAD, ACTION_IN, ACTION_OUT>, payloadOverride?: PAYLOAD) {
    this.payloadOverride = payloadOverride;
  }

  static action<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD,
    ACTION_IN = undefined,
    ACTION_OUT = void>
  (actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>, pipeline: Pipeline<any,any>, payloadOverride?: PAYLOAD): ActionPipe<PAYLOAD, ACTION_IN, ACTION_OUT> {
    // ----- Declaration separator ----- //
    return new ActionPipe<PAYLOAD, ACTION_IN, ACTION_OUT>(new actionClass(pipeline.logDepth + 1), payloadOverride);
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
      return await this._action.execute(payload, this.payloadOverride);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
