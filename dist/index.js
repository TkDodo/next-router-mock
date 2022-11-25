"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRouter = exports.useRouter = exports.memoryRouter = exports.BaseRouter = exports.MemoryRouter = exports.useMemoryRouter = void 0;
const MemoryRouter_1 = require("./MemoryRouter");
const useMemoryRouter_1 = require("./useMemoryRouter");
const withMemoryRouter_1 = require("./withMemoryRouter");
var useMemoryRouter_2 = require("./useMemoryRouter");
Object.defineProperty(exports, "useMemoryRouter", { enumerable: true, get: function () { return useMemoryRouter_2.useMemoryRouter; } });
var MemoryRouter_2 = require("./MemoryRouter");
Object.defineProperty(exports, "MemoryRouter", { enumerable: true, get: function () { return MemoryRouter_2.MemoryRouter; } });
Object.defineProperty(exports, "BaseRouter", { enumerable: true, get: function () { return MemoryRouter_2.BaseRouter; } });
exports.memoryRouter = new MemoryRouter_1.MemoryRouter();
exports.memoryRouter.async = false;
exports.default = exports.memoryRouter;
const useRouter = () => {
    return useMemoryRouter_1.useMemoryRouter(exports.memoryRouter);
};
exports.useRouter = useRouter;
const withRouter = (ComposedComponent) => {
    return withMemoryRouter_1.withMemoryRouter(exports.useRouter, ComposedComponent);
};
exports.withRouter = withRouter;
//# sourceMappingURL=index.js.map