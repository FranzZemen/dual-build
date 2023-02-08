/*
Created by Franz Zemen 12/30/2022
License Type: 
*/
/*
Created by Franz Zemen 12/29/2022
License Type: MIT
*/

import * as chai from 'chai';
import {BootstrapOptions, bootstrapOptions, GitOptions} from 'dual-build';
import _ from 'lodash';
import 'mocha';
import {existsSync, rmSync} from 'node:fs';
import {basename, join, sep} from 'node:path';
import {chdir, cwd} from 'node:process';
import {simpleGit, SimpleGit} from 'simple-git';
import {defaultTargetOptions} from '../../toolx/index.js';
import {Log} from '../../toolx/log/log.js';
import {Pipeline} from '../../toolx/pipeline/index.js';
import {CreateProjectDirectoriesAndCwd} from '../../toolx/transform/bootstrap/create-project-directories-and-cwd.transform.js';
import {InstallGitignore} from '../../toolx/index.js';
import {SetupGit} from '../../toolx/index.js';
import {SaveOptionsPayload, SaveOptionsTransform} from '../../toolx/index.js';
import {BaseTsConfigTransform, BaseTsConfigTransformPayload} from '../../toolx/index.js';
import {GenerateTsConfigsPayload, TargetEnvTsConfigsTransform} from '../../toolx/index.js';
import {processUnknownError} from '../../toolx/index.js';
import '../transform/transform.test.js';

const should = chai.should();
const unreachableCode = false;

describe('dual-build tests', () => {
  describe('pipeline.test', () => {
    describe('Pipeline Integration', () => {
      it('should instantiate and execute transform', async function () {

        const projectDirectoryPath = './test-scaffolding';

        const _bootstrapOptions: BootstrapOptions = _.merge({}, bootstrapOptions);
        _bootstrapOptions['git options'].username = 'SomeUser';
        const log = new Log();
        _bootstrapOptions.directories.root.directoryPath = projectDirectoryPath;
        _bootstrapOptions.directories.root.directoryPath = basename(_bootstrapOptions.directories.root.directoryPath);
        const oldCwd = cwd();

        const baseTsConfigPayload: BaseTsConfigTransformPayload = {
          '.dual-build/tsconfigs': _bootstrapOptions.directories['.dual-build/tsconfigs'],
        }

        try {
          await Pipeline.options<BootstrapOptions>({name: 'Bootstrap', logDepth: 0})
                        .transform<CreateProjectDirectoriesAndCwd, undefined>(CreateProjectDirectoriesAndCwd)
                        .startSeries<InstallGitignore, undefined>(InstallGitignore)
                        .series<SetupGit, GitOptions>(SetupGit, _bootstrapOptions['git options'])
                        .endSeries<SaveOptionsTransform, SaveOptionsPayload>(
                          SaveOptionsTransform,
                          {
                            directory: _bootstrapOptions.directories['.dual-build/options'],
                            ..._bootstrapOptions}
                        )
                        .startParallel<BaseTsConfigTransform, BaseTsConfigTransformPayload>(
                          BaseTsConfigTransform,
                          baseTsConfigPayload
                        )
                        .endParallel<TargetEnvTsConfigsTransform, GenerateTsConfigsPayload>(
                          TargetEnvTsConfigsTransform,
                          ['void'],
                          {
                            path: _bootstrapOptions.directories['.dual-build/tsconfigs'].directoryPath,
                            targetOptions: defaultTargetOptions
                            }
                          )
                        .execute(_bootstrapOptions);

          cwd().should.contain(join(`dual-build${sep}${projectDirectoryPath}`));
          const git: SimpleGit = simpleGit();
          const remotes = await git.getRemotes(true);
          ///log.info(inspect(remotes, false, 10, true));
          Array.isArray(remotes).should.be.true;
          remotes.length.should.equal(1);
          remotes[0]['name'].should.equal('origin');
        } catch (err) {
          processUnknownError(err, log);
          unreachableCode.should.be.true;
        } finally {
          chdir(oldCwd);
           log.info(`reverting working directory to ${oldCwd}`);
          existsSync(projectDirectoryPath).should.be.true;
          rmSync(projectDirectoryPath, {recursive: true, force: true});
        }
      });
    });
  });
});


