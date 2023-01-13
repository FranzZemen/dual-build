"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dummy = void 0;
const yummy_js_1 = require("./yummy.js");
class Dummy {
    constructor() {
    }
    dummy() {
        const yummy = new yummy_js_1.Yummy();
        console.log(yummy.yummy());
    }
}
exports.Dummy = Dummy;
console.log('dummy loaded');
//# sourceMappingURL=dummy.js.map