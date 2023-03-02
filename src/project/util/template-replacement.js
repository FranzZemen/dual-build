/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/
export class TemplateReplacement {
    key;
    constructor(key) {
        this.key = key;
    }
}
export class JSONTemplateReplacement extends TemplateReplacement {
    constructor(key) {
        super(key);
    }
    toString() {
        return this.toJSON();
    }
    toJSON() {
        return `?:<<${this.key}>>`;
    }
}
/*
type MyPatternKey = 'hello' | 'world';
const a = new JSONTemplateReplacement<MyPatternKey>('world');

const b = {a, b: 'hello'};

console.log(JSON.stringify(b));
*/
