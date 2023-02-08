/*
Created by Franz Zemen 02/06/2023
License Type: 
*/

import {Pipeline} from 'dual-build';
import {ExecutablePayload, ExecutableTransform} from 'dual-build';
import {transpilePayload} from './default-payloads.js';

const pipeline = Pipeline.options({name: 'Build', logDepth:0})
  .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, transpilePayload);

pipeline.execute(undefined);


