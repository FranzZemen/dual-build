import _ from 'lodash';
import {Transform, TransformConstructor} from '../transform/index.js';
import {Pipe} from './pipe.js';
import {Pipeline} from './pipeline.js';

export class TransformPipe<PAYLOAD, PIPE_IN, PIPE_OUT> implements Pipe<PIPE_IN, PIPE_OUT>{
  protected constructor(protected _transform: Transform<PAYLOAD, PIPE_IN, PIPE_OUT>, protected payload?: PAYLOAD, ) {
  }


  copy(pipeline: Pipeline<any, any>): TransformPipe<PAYLOAD, PIPE_IN, PIPE_OUT> {
    return new TransformPipe<PAYLOAD, PIPE_IN, PIPE_OUT>(this._transform.copy(pipeline.log.depth + 1),  _.cloneDeep(this.payload));
  }

  static transform<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PAYLOAD,
    PIPE_IN,
    PIPE_OUT = PIPE_IN>
  (transformClass: TransformConstructor<TRANSFORM_CLASS>, pipeline: Pipeline<any,any>, payload?: PAYLOAD): TransformPipe<PAYLOAD, PIPE_IN, PIPE_OUT> {
    // ----- Declaration separator ----- //
    return new TransformPipe<PAYLOAD, PIPE_IN, PIPE_OUT>(new transformClass(pipeline.log.depth + 1), payload);
  }

  get transformName(): string {
    if (this._transform) {
      return this._transform.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(pipedIn: PIPE_IN): Promise<PIPE_OUT> {
    const actionName = this.transformName;
    try {
      return await this._transform.execute(pipedIn, this.payload);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
