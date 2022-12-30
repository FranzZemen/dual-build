/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/

export type CommandHookFunction<T extends Array<any>> = (...args:T) => void;

export type CommandOptions = {
  beforeStart:  CommandHookFunction<[command: string]>;
  afterFinish: CommandHookFunction<[command: string]>;
}


export function Command<T extends CommandOptions>(options: T) {
  return function (constructor: Function) {
    constructor.prototype.options = options;
  };
}
export abstract class AbstractCommand {
  protected constructor() {
  }
  abstract execute(): void;
}
