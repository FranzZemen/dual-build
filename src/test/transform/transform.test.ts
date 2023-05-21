/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import '../pid.test.js'
import * as chai from 'chai';
import 'mocha';
import {Transform} from '#project';
import {EmittingConsole, Log} from '#project';

const should = chai.should();

class TestTransform extends Transform<number, number, string> {
  constructor() {
    super(3);
  }

  public executeImpl(payload: number, payloadOverride?: number): Promise<string> {
    return Promise.resolve(payload.toString(10));
  }

  public transformContext(): string {
    return '';
  }

}




describe('dual-build tests', () => {
  describe('transform.test', () => {
    describe('Transform', () => {
      it('should instantiate and execute transform', function () {
        const emittingConsole: EmittingConsole = new EmittingConsole();
        const stdout: string[] = [];
        const stderr: string[] = [];

        emittingConsole.on('stdout', (value: string) => {
          stdout.push(value);
        })
        emittingConsole.on('stderr', (value: string) => {
          stderr.push(value);
        })
        Log.setDefaultConsole(emittingConsole.console);
        const transform = new TestTransform();
        return transform.execute(5, 3)
                     .then(output => {
                       output.should.equal('5');
                     })
                     .finally(() => {
                       stderr.length.should.equal(0);
                       stdout.length.should.equal(2);
                       stdout[0]?.should.contain('starting...');
                       stdout[1]?.should.contain('...transform');
                       emittingConsole.removeAllListeners();
                       Log.resetDefaultConsole();
                     });
      });
    });
  });
});


