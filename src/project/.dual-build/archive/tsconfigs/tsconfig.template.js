"use strict";
/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.mergeTSConfig = void 0;
var tsconfig_d_ts_1 = require("tsconfig.d.ts");
function mergeTSConfig(envTSConfig) {
    return __assign(__assign({}, tsconfig_d_ts_1.tsconfigBase), envTSConfig);
}
exports.mergeTSConfig = mergeTSConfig;
/*
export type CompilerOptionsOmitted = Omit<CompilerOptions, CompileOptionTemplateNames>;

class CompilerOptionJSONReplacement extends JSONTemplateReplacement<CompileOptionTemplateNames> {
  constructor(key: CompileOptionTemplateNames) {
    super(key);
  }
}

export type CompilerOptionsTemplate = CompilerOptionsOmitted & {
  moduleResolution?:  moduleResolution  | CompilerOptionJSONReplacement | undefined;
  module?:            Module            | CompilerOptionJSONReplacement | undefined;
  target?:            Target            | CompilerOptionJSONReplacement | undefined;
  outDir?:            string            | CompilerOptionJSONReplacement | undefined;
}

export type TSConfigTemplate = Omit<TsConfig, 'compilerOptions'> & {
  compilerOptions: CompilerOptionsTemplate;
}

const module            = new CompilerOptionJSONReplacement('module');
const moduleResolution  = new CompilerOptionJSONReplacement('moduleResolution');
const target            = new CompilerOptionJSONReplacement('target');
const outDir            = new CompilerOptionJSONReplacement('outDir');

const tsConfigTemplateOnly: TSConfigTemplate = {
  compilerOptions: {
    module,
    moduleResolution,
    target,
    outDir
  }
}*/
