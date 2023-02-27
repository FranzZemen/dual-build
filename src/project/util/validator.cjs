"use strict";
// fastest-validator does not export Validator properly when compbined with ESM + nodenext moduleResolution per
// typescript issues read.  However, the error is really one of typescript religiousness, because code *would* run.
// Not likely that either fastest-validator (or the many src that have this problem with default exports
// will be solving for it soon, neither will typescript.  This handy workaround works, though.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidator = void 0;
const tslib_1 = require("tslib");
const fastest_validator_1 = tslib_1.__importDefault(require("fastest-validator"));
const options = { useNewCustomCheckerFunction: true };
const getValidator = () => {
    return new fastest_validator_1.default(options);
};
exports.getValidator = getValidator;
