/*
Created by Franz Zemen 01/03/2023
License Type: 
*/

import {v4 as uuidv4} from 'uuid';

export type DigestEntry = {
  uuid: string,
  timestamp: string,
  entry: string,
  data?: object
}


export class Digest {
  constructor(private filename: string) {

  }

  digest(timestamp: Date, entry: string, data?: object) {

  }
}
