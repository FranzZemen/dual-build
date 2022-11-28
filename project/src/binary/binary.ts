/*

import {TaskRef} from '../task/task-function.js';

export type BinaryRef = string;

export type BinaryDescriptor = {
  ref: BinaryRef;
  path?: string;
  taskRefs: TaskRef [];
}*/

import {compileFunction} from 'vm';
import {glob} from '../task/native/glob-task.js';

clean
glob().pipe(delete).pipe)





binary  - external api composed

script - a standalone action that can be combined with other standalone actions to form a binary


task = an action which is often of limited use without combining with other(action), usually through streaming.

in the extreme a task can also be a script, can also be a command


build   clean
        compile


clean:  glob().pipe(delete).pipe(stats)


glob
delete   tasks

