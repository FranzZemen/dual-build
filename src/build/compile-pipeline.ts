/*
Created by Franz Zemen 02/06/2023
License Type:
*/

import {processUnknownError} from 'dual-build/project';
import {ExecutablePayload, ExecutableTransform, Pipeline} from 'dual-build/project';


const pipeline = Pipeline.options({name: 'Compile', logDepth: 0})
  // Compile all typescript - what's needed for the local build as well as for the package build via tsc project
                         .transform<ExecutableTransform, ExecutablePayload>(ExecutableTransform, {
                           executable: 'npx tsc',
                           cwd: './',
                           arguments: ['-b'],
                           batchTarget: false,
                           synchronous: false, // Synchronization handled by transform
                           stdioTreatment: 'error',
                           stderrTreatment: 'error',
                         })
                         .execute(undefined)
                         .catch(err => {
                           processUnknownError(err, console, 'Unknown error');
                         });



