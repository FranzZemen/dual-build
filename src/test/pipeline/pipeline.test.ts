/*
Created by Franz Zemen 12/30/2022
License Type: 
*/
/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import * as chai from 'chai';
import {rmSync} from 'fs';
import _ from 'lodash';
import 'mocha';
import {existsSync} from 'node:fs';
import {basename} from 'node:path';
import {CreateDirectories} from '../../toolx/action/bootstrap/directories/create-directories.action.js';
import {Log} from '../../toolx/log/log.js';
import {bootstrapOptions} from '../../toolx/options/bootstrap-options.js';
import {ContainsDirectories} from '../../toolx/options/directories.js';
import {Pipeline} from '../../toolx/pipeline/pipeline.js';
import {processUnknownError} from '../../toolx/util/process-unknown-error-message.js';
import '../action/action.test.js';

const should = chai.should();
const unreachableCode = false;

describe('dual-build tests', () => {
  describe('pipeline.test', () => {
    describe('Pipeline Integration', () => {
      it('should instantiate and execute action', async function () {

        const options = _.merge({}, bootstrapOptions);
        const log = new Log();
        options.directories.root.directoryPath = './test-scaffolding';
        options.directories.root.folder = basename(options.directories.root.directoryPath);
        try {
          await Pipeline.options<void, void>({name: 'test-scaffolding', logDepth: 0})
                        .action<CreateDirectories, ContainsDirectories>(CreateDirectories, options)
                        .execute();

          existsSync('./test-scaffolding').should.be.true;
        } catch (err) {
          log.error(processUnknownError(err));
          unreachableCode.should.be.true;
        } finally {
          rmSync('./test-scaffolding', {recursive: true, force: true});
        }
      });
    });
  });
});


