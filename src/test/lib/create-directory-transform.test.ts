import 'mocha';
import * as chai from 'chai';
import {join} from "node:path";
import {cwd} from "node:process";
import {statSync} from "node:fs"
import {CreateDirectoryTransform,CreateDirectoryPayload} from '#project';


const should = chai.should();
const expect = chai.expect;

describe('dual-build tests', () => {
  describe('create-directory-transform test', () => {
    describe('create-directory-transform.test', () => {
      const directory = './out/create-directory-transform.test';
      const payload: CreateDirectoryPayload = {
        directory,
        errorOnExists: false
      };
      it('should create a directory', async function () {
        const transform = new CreateDirectoryTransform(0);
        await transform.execute(undefined, payload);
        const stat = statSync(directory);
        stat.isDirectory().should.be.true;
      });
    });
  });
})

