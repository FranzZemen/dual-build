/*
Created by Franz Zemen 12/10/2022
License Type: 
*/


import {argv,exit} from 'node:process';
import _ from 'lodash';
import {createDirectories} from '../action/bootstrap/createDirectories.js';
import {bootstrapOptions} from '../options/bootstrap-options.js';

const options = _.merge({}, bootstrapOptions);

if(argv.length === 3 && argv[2].trim().length > 0) {
  options.directories.root = argv[2];
} else {
  console.log('No folder provided.  Specify project folder');
  exit(1);
}


try {
  await createDirectories(options.directories)
} catch (err) {
  console.log(err);
}


/*
import {Readable, Writable} from 'node:stream';
import {inspect} from 'node:util';
import {argv,exit} from 'node:process';
import {BootstrapPayload, DirectoriesAction} from '../action/bootstrap/directories-action.js';
import {bootstrapOptions} from '../options/bootstrap-options.js';

const dirAction = new DirectoriesAction();

const payload: BootstrapPayload = {
  options: bootstrapOptions
}
let pushed = false;

if(argv.length === 3 && argv[2].trim().length > 0) {
  payload.options.directories.root = argv[2];
} else {
  console.log('No folder provided.  Specify project folder');
  exit(1);
}


class Start extends Readable {
  constructor() {
    super({objectMode: true});
  }
  _read(size) {
    if (!pushed) {
      console.log('Start:  Started Pipe');
      // @ts-ignore
      this.push(payload);
      pushed = true;
    }
    else {
      console.log('Start: EOF')
      // @ts-ignore
      this.push(null);
    }
  }
}

class End extends Writable {
  constructor() {
    super({objectMode: true});
  }
  _write(chunk, encoding, callback) {
    console.log(`Ended  Pipe ${inspect(chunk, false, 10, true)}`);
    callback();
  }
}
const start = new Start();
const end = new End();

start.pipe(dirAction).pipe(end);
*/
