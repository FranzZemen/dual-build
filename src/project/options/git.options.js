import { basename } from 'node:path';
import { cwd } from 'node:process';
import { directories } from './directories.js';
export var GitProtocol;
(function (GitProtocol) {
    GitProtocol["https"] = "https://github.com/";
    GitProtocol["git"] = "git@github.com:";
    GitProtocol["ssh"] = "ssh://git@github.com/";
})(GitProtocol = GitProtocol || (GitProtocol = {}));
export const gitOptions = {
    useGit: true,
    repository: () => basename(cwd()),
    protocol: GitProtocol.https,
    'git init': true,
    'git remote add origin': true,
    'git push current branch on successful build': true,
    'git push current branch on successful publish': true
};
export const gitignore = [
    directories.node_modules.directoryPath,
    directories.bin.directoryPath,
    directories.transient.directoryPath,
    directories['.dual-build/logs'].directoryPath,
    // join(directories.src.directoryPath, packageJson),
    // join(directories.test.directoryPath, packageJson),
    '.zip',
    '.idea'
];
