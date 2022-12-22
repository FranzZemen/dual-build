/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


export abstract class Action<IN, OUT> {
  protected constructor() {
  }

  /**
   * When called directly from Action, executes a pipeline that contains only "this" action.
   * @param payload
   * @param bypass
   */
  abstract execute(payload: IN, bypass?: OUT): Promise<OUT>;
}
