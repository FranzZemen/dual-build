/*
Created by Franz Zemen 12/04/2022
License Type: 
*/
export type AvailableHooks =
  'beforeCommand'
  | 'afterCommand';

export type HookCommand = () => void;
export type Hooks = Partial<Record<AvailableHooks, HookCommand>>;


export function CommandHook(hooks: Hooks) {
  return function (constructor: Function) {
    constructor.prototype.hooks = hooks;
  };
}
