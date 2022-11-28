/*
// Wrapper for fg.stream

class Src extends Readable {
 sourceStream: ReadableStream
   constructor(pattern: string | string[]) {
    super({objectMode: true});
    this.sourceStream = fg.stream(pattern, {objectMode: true});
    this.sourceStream
      .on('data', (chunk) => {
        if(chunk) {
          const entry: Entry = chunk;
          const fileObject = {name: entry.name, path: entry.path};
          if(!this.push(fileObject)) {
            this.sourceStream.pause();
          }
        }
      })
      .on('end', () => {
        this.push(null);
      })
  }
  _read(size: number) {
   if(this.sourceStream.isPaused()) {
     this.sourceStream.resume();
   }
  }
}


export function src(pattern: string | string[]): Readable  {
  return new Src(pattern);
}
*/
