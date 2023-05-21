#!/usr/bin/env node
/*
Created by Franz Zemen 04/28/2023
License Type: MIT
*/

import {bootstrapPipeline as bootstrap, _bootstrapOptions} from 'dual-build/project';

console.log('bin/bootstrap called');

/*
loadConfiguration('./dual-build/dual-build.config.json')
    .then((config:BootstrapConfiguration) => {
        console.log(config);
    });
*/
bootstrap.execute(_bootstrapOptions);

