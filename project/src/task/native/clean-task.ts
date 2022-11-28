import {CommonOptions} from '../../options/common-options.js';
import {TaskFunction} from '../task-function.js';
import {Task} from '../task.js';

export type CleanTaskOptions = CommonOptions & {
  glob: string | string[];
}

