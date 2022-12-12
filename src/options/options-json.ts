/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/

import {Duplex} from 'stream';

class OptionsJson<T> extends Duplex {
  private static readonly fifo: unique symbol = Symbol('fifo');

  constructor() {
    super({objectMode: true});
    this[OptionsJson.fifo]  = [] as T[];
  }

  private get fifo(): T[] {
    return this[OptionsJson.fifo] as T[];
  }


  _read(size: number) {

  }


  _write(chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) {
    super._write(chunk, encoding, callback);
  }
}
