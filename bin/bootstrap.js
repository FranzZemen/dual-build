#!/usr/bin-command/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../publish/index.js");
const hooks = {
    beforeCommand: () => console.log('before command')
};
let HookedBootstrapCommand = class HookedBootstrapCommand extends index_js_1.BootstrapCommand {
    constructor() {
        super();
    }
};
HookedBootstrapCommand = __decorate([
    (0, index_js_1.CommandHook)({
        beforeCommand: () => console.log('before command')
    })
], HookedBootstrapCommand);
(new HookedBootstrapCommand()).execute();
//# sourceMappingURL=bootstrap.js.map