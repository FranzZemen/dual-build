import { licenseIds } from '../util/license-ids.cjs';
export var PackageManager;
(function (PackageManager) {
    PackageManager["npm"] = "npm";
    PackageManager["pnpm"] = "pnpm";
    PackageManager["yarn"] = "yarn";
})(PackageManager = PackageManager || (PackageManager = {}));
export const npxCommands = {
    npm: 'npx',
    pnpm: 'pnpm dlx',
    yarn: 'yarn dlx'
};
export var ModuleType;
(function (ModuleType) {
    ModuleType["module"] = "module";
    ModuleType["commonjs"] = "commonjs";
})(ModuleType = ModuleType || (ModuleType = {}));
export const defaultProjectPackage = {
    name: '%{Package Name}',
    description: '%{Description}',
    version: '0.0.1',
    type: ModuleType.module,
    scripts: {},
    bin: {},
    main: './index.js',
    types: './types',
    exports: {},
    imports: {},
    license: licenseIds.indexOf('MIT') >= 0 ? 'MIT' : 'UNLICENSED',
    author: '%{Author}'
};
export const defaultExports = {
    exports: {
        '.': {
            'types': './types',
            'require': './cjs/index.js',
            'import': './esm/index.js'
        }
    }
};
export const defaultDistPackage = { ...defaultProjectPackage, ...{ defaultExports } };
export const distEsmPackage = {
    type: ModuleType.module
};
export const distCjsPackage = {
    type: ModuleType.commonjs
};
export const defaultBootstrapPackageOptions = {
    'package manager': PackageManager.npm,
    'initial version': '0.0.1'
};
