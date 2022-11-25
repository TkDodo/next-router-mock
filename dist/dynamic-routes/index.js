"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Automatically try to export the correct version:
try {
    module.exports = require("./next-12");
}
catch (firstErr) {
    try {
        module.exports = require("./next-11");
    }
    catch (_a) {
        try {
            module.exports = require("./next-10");
        }
        catch (_b) {
            throw firstErr;
        }
    }
}
//# sourceMappingURL=index.js.map