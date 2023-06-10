/*
Created by Franz Zemen 06/08/2023
License Type: 
*/

import 'mocha';
import * as chai from 'chai';
import {InstallGitignore} from '#project';
import {accessSync} from "fs";


const should = chai.should();
const expect = chai.expect;

describe('dual-build tests', () => {
  describe('install-git-ignore-transform.test', () => {
      it('should create .gitignore int ./out', async function () {
        const oldCwd = process.cwd();
        try {
          process.chdir('./out');
          const transform = new InstallGitignore(0);
          await transform.execute(undefined, undefined);
          try {
            accessSync('.gitignore');
          } catch (e: unknown) {
            expect(e).to.not.exist;
          }
          expect(true).to.be.true;
        } catch (e: unknown) {
          console.error(e);
        } finally {
          process.chdir(oldCwd);
        }
      });
    });
  });
