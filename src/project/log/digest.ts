/*
Created by Franz Zemen 01/03/2023
License Type: 
*/

export type DigestEntry = {
  uuid: string,
  timestamp: string,
  entry: string,
  data?: object
}


export class Digest {
  constructor(protected filename: string) {

  }

  digest(timestamp: Date, entry: string, data?: object) {
    this.filename = 'hello';
  }
}
