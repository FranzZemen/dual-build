export type ReplacementPattern<Prefix extends string, PatternKey extends string, Suffix extends string> = `${Prefix}${PatternKey}${Suffix}`;
export type JSONReplacementPattern<PatternKey extends string> = ReplacementPattern<'?:<<', PatternKey, '>>'>;
export declare abstract class TemplateReplacement<PatternKey extends string, ToString extends ReplacementPattern<any, any, any>> {
    protected key: PatternKey;
    protected constructor(key: PatternKey);
    abstract toString(): ToString;
}
export declare class JSONTemplateReplacement<PatternKey extends string> extends TemplateReplacement<PatternKey, JSONReplacementPattern<PatternKey>> {
    constructor(key: PatternKey);
    toString(): JSONReplacementPattern<PatternKey>;
    toJSON(): JSONReplacementPattern<PatternKey>;
}
