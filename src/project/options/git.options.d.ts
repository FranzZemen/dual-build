export declare enum GitProtocol {
    https = "https://github.com/",
    git = "git@github.com:",
    ssh = "ssh://git@github.com/"
}
export type GitOptions = {
    useGit: boolean;
    username?: string;
    repository: string | (() => string);
    protocol?: GitProtocol;
    'git init'?: boolean;
    'git remote add origin'?: boolean;
    'git push current branch on successful build'?: boolean;
    'git push current branch on successful publish'?: boolean;
};
export type ContainsGitOptions = {
    gitOptions: GitOptions;
};
export declare const gitOptions: GitOptions;
export declare const gitignore: string[];
