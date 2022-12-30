/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

export type ReplacementPattern<Prefix extends string,PatternKey extends string,Suffix extends string> = `${Prefix}${PatternKey}${Suffix}`;

export type JSONReplacementPattern<PatternKey extends string> = ReplacementPattern<'?:<<', PatternKey, '>>'>


export abstract class TemplateReplacement<PatternKey extends string, ToString extends ReplacementPattern<any, any, any>> {
  protected constructor(protected key: PatternKey) {
  }

 abstract toString(): ToString;
}


export class JSONTemplateReplacement<PatternKey extends string> extends TemplateReplacement<PatternKey, JSONReplacementPattern<PatternKey>> {
  constructor(key: PatternKey) {
    super(key);
  }

  toString(): JSONReplacementPattern<PatternKey> {
    return this.toJSON();
  }

  toJSON(): JSONReplacementPattern<PatternKey> {
    return `?:<<${this.key}>>`;
  }
}

/*
type MyPatternKey = 'hello' | 'world';
const a = new JSONTemplateReplacement<MyPatternKey>('world');

const b = {a, b: 'hello'};

console.log(JSON.stringify(b));
*/
