"use strict";
/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.JSONTemplateReplacement = exports.TemplateReplacement = void 0;
var TemplateReplacement = /** @class */ (function () {
    function TemplateReplacement(key) {
        this.key = key;
    }
    return TemplateReplacement;
}());
exports.TemplateReplacement = TemplateReplacement;
var JSONTemplateReplacement = /** @class */ (function (_super) {
    __extends(JSONTemplateReplacement, _super);
    function JSONTemplateReplacement(key) {
        return _super.call(this, key) || this;
    }
    JSONTemplateReplacement.prototype.toString = function () {
        return this.toJSON();
    };
    JSONTemplateReplacement.prototype.toJSON = function () {
        return "?:<<".concat(this.key, ">>");
    };
    return JSONTemplateReplacement;
}(TemplateReplacement));
exports.JSONTemplateReplacement = JSONTemplateReplacement;
/*
type MyPatternKey = 'hello' | 'world';
const a = new JSONTemplateReplacement<MyPatternKey>('world');

const b = {a, b: 'hello'};

console.log(JSON.stringify(b));
*/
