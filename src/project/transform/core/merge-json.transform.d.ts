export declare abstract class MergeJsonTransformBase {
    protected constructor();
    protected executeImplIndependent(): Promise<void>;
    protected abstract getSourcePath(): string;
    protected abstract getTargetPath(): string;
    protected abstract getMergePath(): string;
}
