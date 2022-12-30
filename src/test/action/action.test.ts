/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import * as chai from 'chai';
import 'mocha';
import {Action} from '../../toolx/index.js';
import {EmittingConsole, Log} from '../../toolx/log/log.js';

const should = chai.should();

class TestAction extends Action<number, string> {
  constructor() {
    super(3);
  }

  public executeImpl(payload: number, bypass?: string | undefined): Promise<string> {
    return Promise.resolve(payload.toString(10));
  }

}




describe('dual-build tests', () => {
  describe('action.test', () => {
    describe('Action.test', () => {
      it('should instantiate and execute action', function () {
        const emittingConsole: EmittingConsole = new EmittingConsole();
        const stdout: string[] = [];
        const stderr: string[] = [];

        emittingConsole.on('stdout', (value: string) => {
          stdout.push(value);
        })
        emittingConsole.on('stderr', (value: string) => {
          stderr.push(value);
        })
        Log.setConsole(emittingConsole.console);
        const action = new TestAction();
        return action.execute(5)
                     .then(output => {
                       output.should.equal('5');
                     })
                     .finally(() => {
                       stderr.length.should.equal(0);
                       stdout.length.should.equal(2);
                       stdout[0].should.contain('starting...');
                       stdout[1].should.contain('...action');
                       emittingConsole.removeAllListeners();
                     });
      });
    });
  });
});


