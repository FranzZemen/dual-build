import {Transform, TransformConstructor} from '../transform/transform.js';
import {Pipeline} from './pipeline.js';

export class TransformPipe<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT> {
  protected payloadOverride: PAYLOAD | undefined;
  protected constructor(protected _transform: Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>, payloadOverride?: PAYLOAD) {
    this.payloadOverride = payloadOverride;
  }

  static transform<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>
  (transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>, pipeline: Pipeline<any,any>, payloadOverride?: PAYLOAD): TransformPipe<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT> {
    // ----- Declaration separator ----- //
    return new TransformPipe<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>(new transformClass(pipeline.log.depth + 1), payloadOverride);
  }

  get transformName(): string {
    if (this._transform) {
      return this._transform.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(payload: TRANSFORM_IN): Promise<TRANSFORM_OUT> {
    const actionName = this.transformName;
    try {
      return await this._transform.execute(payload, this.payloadOverride);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
