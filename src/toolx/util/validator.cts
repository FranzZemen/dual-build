// fastest-validator does not export Validator properly when compbined with ESM + nodenext moduleResolution per
// typescript issues read.  However, the error is really one of typescript religiousness, because code *would* run.
// Not likely that either fastest-validator (or the many src that have this problem with default exports
// will be solving for it soon, neither will typescript.  This handy workaround works, though.

import {ValidatorConstructorOptions} from 'fastest-validator';
import Validator from 'fastest-validator';
const options: ValidatorConstructorOptions = {useNewCustomCheckerFunction: true};

const getValidator: () => Validator = () => {
  return new Validator(options);
}

export {
  getValidator
}
