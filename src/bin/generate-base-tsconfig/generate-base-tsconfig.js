"use strict";
/*
Created by Franz Zemen 02/11/2023
License Type:
*/
exports.__esModule = true;
exports.generate = void 0;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var project_1 = require("dual-build/project");
function generate(projectRoot) {
    var base = { compilerOptions: project_1.defaultBaseCompilerOptions };
    // @ts-ignore
    base.compilerOptions.composite = true;
    // @ts-ignore
    base.compilerOptions.incremental = true;
    // @ts-ignore
    base.compilerOptions.declaration = true;
    (0, node_fs_1.writeFileSync)((0, node_path_1.join)(projectRoot, './tsconfig.base.json'), JSON.stringify(base, undefined, 2), { encoding: 'utf-8' });
}
exports.generate = generate;
