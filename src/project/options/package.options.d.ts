import { Version } from '../util/semver.js';
export declare enum PackageManager {
    npm = "npm",
    pnpm = "pnpm",
    yarn = "yarn"
}
export type NpxCommandType = 'npx' | 'pnpm dlx' | 'yarn dlx';
export type NpxCommands = {
    [key in PackageManager]: NpxCommandType;
};
export declare const npxCommands: NpxCommands;
export declare enum ModuleType {
    module = "module",
    commonjs = "commonjs"
}
export type Script = string;
export type Scripts = {
    [key: string]: Script;
};
export type Binary = string;
export type Binaries = {
    [key: string]: Binary;
};
export type ConditionalExportKeys = 'require' | 'import' | 'node' | 'node-addons' | 'default' | 'types' | 'browser' | 'react-native' | 'development' | 'production' | 'deno';
export type PackageSubPath = '.' | `./${string}`;
export type ConditionalExports = {
    [key in ConditionalExportKeys]?: PackageSubPath;
};
export type ConditionalSubPathExports = {
    [key in PackageSubPath]?: {
        [key in ConditionalExportKeys]?: PackageSubPath;
    };
};
export type Exports = PackageSubPath | ConditionalExports | ConditionalSubPathExports;
export type ImportsKey = `#${string}`;
export type ImportsSubPath = `./${string}` | string;
export type ConditionalSubPathImports = {
    [key: ImportsKey]: {
        [key in ConditionalExportKeys]?: ImportsSubPath;
    };
};
export type Imports = {
    [key: ImportsKey]: ImportsSubPath;
} | ConditionalSubPathImports;
export type Main = PackageSubPath;
export type CommonPublicDomainLicenseIds = 'PD' | 'CCO';
export type CommonPermissiveLicenseIds = 'MIT' | 'Apache' | 'MPL';
export type CommonCopyLeftLicenseIds = 'GPL' | 'AGPL';
export type CommonNonCommercialLicenseIds = 'JRL' | 'AFPL';
export type Unlicensed = 'UNLICENSED' | `SEE LICENSE IN ${string}`;
export type License = CommonPublicDomainLicenseIds | CommonPermissiveLicenseIds | CommonCopyLeftLicenseIds | CommonNonCommercialLicenseIds | Unlicensed | string;
export type Dependencies = {
    [key: string]: string;
};
export type Package = {
    name?: string;
    description?: string;
    version?: Version;
    type?: ModuleType;
    scripts?: Scripts;
    bin?: Binaries;
    main?: Main;
    types?: `./${string}`;
    exports?: Exports;
    imports?: Imports;
    license?: License;
    author?: string;
    dependencies?: Dependencies;
    devDependencies?: Dependencies;
};
export declare const defaultProjectPackage: Package;
export declare const defaultExports: Package;
export declare const defaultDistPackage: Package;
export declare const distEsmPackage: Package;
export declare const distCjsPackage: Package;
export type BootstrapPackageOptions = {
    author?: string;
    description?: string;
    license?: string;
    'package manager'?: PackageManager | undefined;
    'initial version'?: Version | undefined;
};
export declare const defaultBootstrapPackageOptions: BootstrapPackageOptions;
