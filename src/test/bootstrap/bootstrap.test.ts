/*
Created by Franz Zemen 07/22/2023
License Type: 
*/
import 'mocha';
import * as chai from 'chai';
import {join} from "node:path";
import {cwd} from "node:process";
import {statSync} from "node:fs"
import {CreateDirectoryTransform,CreateDirectoryPayload} from '#project';
import {bootstrapPipeline as bootstrap, _bootstrapOptions} from 'dual-build/project';




const should = chai.should();
const expect = chai.expect;

describe('dual-build tests', () => {
  describe('bootstrap test', () => {
    console.log('bin/bootstrap called');

    /*
    loadConfiguration('./dual-build/dual-build.config.json')
        .then((config:BootstrapConfiguration) => {
            console.log(config);
        });
    */
    bootstrap.execute(_bootstrapOptions);
  })
});
