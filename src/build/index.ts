/*
Created by Franz Zemen 02/06/2023
License Type: 
*/

import {Pipeline} from 'dual-build/project';
import {ExecutablePayload, ExecutableTransform} from 'dual-build/project';
import {DistributionPackageJsonTransform} from 'dual-build/project';
import {transpilePayload} from './default-payloads.js';


const pipeline = Pipeline.options({name: 'Build', logDepth: 0})
                         // Compile all typescript - what's needed for the local build as well as for the package build via tsc project
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, transpilePayload)
                         .transform<DistributionPackageJsonTransform>(DistributionPackageJsonTransform)
                         .execute(undefined);



