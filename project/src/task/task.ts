import {CommonOptions} from '../options/common-options.js';
import {TaskOptions} from '../options/task/task-options.js';
import {TaskFunction} from './task-function.js';
import {loadFromModule} from '@franzzemen/module-factory';

export type Task<T extends TaskOptions,R> = {
  name: string;
  // Is native to dual-build package
  native: boolean;
  taskFunction: TaskFunction<T, R>;
}


/**
 *
 * @param moduleName A package (module) OR module expressed by an absolute or relative path
 * @param factoryFunctionName Name of the factory function (potentially nested with dot ".") that will return the Task
 * @param paramsArray Any parameters the factory function requires.
 */
export function importTask<T extends TaskOptions, R>(moduleName: string, factoryFunctionName: string, paramsArray: any[]) : Promise<Task<T,R>> {
  return loadFromModule<Task<T,R>>({moduleName, functionName: factoryFunctionName, paramsArray});
}


