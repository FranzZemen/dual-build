/*
Created by Franz Zemen 02/06/2023
License Type: 
*/

import {DistributionPackageJsonPayload} from 'dual-build/project';
import {Pipeline} from 'dual-build/project';
import {ExecutablePayload, ExecutableTransform} from 'dual-build/project';
import {DistributionPackageJsonTransform} from 'dual-build/project';
import {CreatePackageTransform, CreatePackagePayload} from 'dual-build/project';
import {ModuleType} from 'dual-build/project';
import {CheckInTransform} from 'dual-build/project';
import {CommitTransform, CommitPayload} from 'dual-build/project';
import {transpilePayload} from './default-payloads.js';


const pipeline = Pipeline.options({name: 'Build', logDepth: 0})
  // Compile all typescript - what's needed for the local build as well as for the package build via tsc project
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, transpilePayload)
                         .transform<DistributionPackageJsonTransform, DistributionPackageJsonPayload>(DistributionPackageJsonTransform, {
                           targetPath: './out.dist/package.json',
                           exclusions: ['type', 'scripts', 'imports', 'exports', 'bin', 'devDependencies', 'nodemonConfig'],
                           inclusions: {
                             exports: {
                               '.': {
                                 types: './types',
                                 import: './esm/index.js',
                                 require: './cjs/index.js'
                               }
                             },
                             main: './cjs/index.js',
                             types: './types'
                           }
                         })
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out.dist/esm/package.json',
                           package: {type: ModuleType.module}
                         })
                         .transform<CreatePackageTransform, CreatePackagePayload>(CreatePackageTransform, {
                           targetPath: './out.dist/cjs/package.json',
                           package: {type: ModuleType.commonjs}
                         })
                         .transform<CheckInTransform>(CheckInTransform)
                         .transform<CommitTransform, CommitPayload>(CommitTransform, undefined)
                         .execute(undefined);



