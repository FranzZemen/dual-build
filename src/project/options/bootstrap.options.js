import pkg from '../util/validator.cjs';
const getValidator = pkg.getValidator;
import { directories, directoriesWrappedSchema } from './directories.js';
import { gitignore, gitOptions } from './git.options.js';
import { defaultBootstrapPackageOptions } from './package.options.js';
import { sources } from './sources.js';
import { defaultTestStrategy } from './test-strategy-options.js';
import { es6, nodenext } from './tsconfig.options.js';
export const bootstrapOptions = {
    filename: 'bootstrap-options.json',
    // modified: undefined,  Case by case
    'save profile': true,
    'git options': gitOptions,
    'install module loader': 'install both',
    'bin source': 'esm/bin',
    'package options': defaultBootstrapPackageOptions,
    'target options': {
        'primary commonjs': 'es6',
        'primary esm': 'nodenext',
        options: [es6, nodenext]
    },
    directories,
    sources,
    'build options': { buildEsm: true, buildCommonJS: true },
    'test strategy': defaultTestStrategy,
    '.gitignore': gitignore,
};
const bootstrapSchema = {
    directories: directoriesWrappedSchema
};
const bootstrapWrappedSchema = {
    $$strict: false,
    type: 'object',
    props: {
        filename: { type: 'string' }
    }
};
const compiled = (getValidator()).compile(bootstrapSchema);
let check;
if (compiled.async) {
    console.error('Unreachable Code');
}
else {
    check = compiled; //!compiled.async ? compiled : (()=>{if(compiled.async) {throw new Error('Unexpected AsyncCheckFunction')} else { return undefined;}})();
}
export function validate(options) {
    return check(options);
}
