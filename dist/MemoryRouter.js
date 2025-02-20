"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRouter = exports.BaseRouter = void 0;
const mitt_1 = __importDefault(require("./lib/mitt"));
const url_1 = require("url");
const querystring_1 = require("querystring");
/**
 * A base implementation of NextRouter that does nothing; all methods throw.
 */
class BaseRouter {
    constructor() {
        this.isReady = true;
        this.route = "";
        this.pathname = "";
        this.hash = "";
        this.query = {};
        this.asPath = "";
        this.basePath = "";
        this.isFallback = false;
        this.isPreview = false;
        this.isLocaleDomain = false;
        this.locale = undefined;
        this.locales = [];
        this.events = mitt_1.default();
    }
    back() {
        // Do nothing
    }
    beforePopState() {
        // Do nothing
    }
    async prefetch() {
        // Do nothing
    }
    reload() {
        // Do nothing
    }
}
exports.BaseRouter = BaseRouter;
/**
 * An implementation of NextRouter that does not change the URL, but just stores the current route in memory.
 */
class MemoryRouter extends BaseRouter {
    constructor(initialUrl, async) {
        super();
        /**
         * When enabled, there will be a short delay between calling `push` and when the router is updated.
         * This is used to simulate Next's async behavior.
         * However, for most tests, it is more convenient to leave this off.
         */
        this.async = false;
        /**
         * This method was removed in v0.7.0.
         * It has been replaced with "mockRouter.useParser(createDynamicRouteParser(...))"
         * See the README for more details on upgrading.
         * @deprecated
         */
        this.registerPaths = (() => {
            throw new Error(`
       This method was removed in v0.7.0.
       It has been replaced with "mockRouter.useParser(createDynamicRouteParser(...))"
       See the README for more details on upgrading.
    `);
        });
        this.push = (url, as, options) => {
            return this._setCurrentUrl(url, as, options, "push");
        };
        this.replace = (url, as, options) => {
            return this._setCurrentUrl(url, as, options, "replace");
        };
        /**
         * Sets the current Memory route to the specified url, synchronously.
         */
        this.setCurrentUrl = (url, as) => {
            // (ignore the returned promise)
            void this._setCurrentUrl(url, as, undefined, "set", false);
        };
        if (initialUrl)
            this.setCurrentUrl(initialUrl);
        if (async)
            this.async = async;
    }
    static snapshot(original) {
        return Object.assign(new MemoryRouter(), original);
    }
    useParser(parser) {
        this.events.on("NEXT_ROUTER_MOCK:parse", parser);
        return () => this.events.off("NEXT_ROUTER_MOCK:parse", parser);
    }
    async _setCurrentUrl(url, as, options, source, async = this.async) {
        // Parse the URL if needed:
        const newRoute = parseUrlToCompleteUrl(url, this.pathname);
        let asPath;
        let asRoute;
        if (as === undefined) {
            asRoute = undefined;
            asPath = getRouteAsPath(newRoute.pathname, newRoute.query, newRoute.hash);
        }
        else {
            asRoute = parseUrlToCompleteUrl(as, this.pathname);
            asPath = getRouteAsPath(asRoute.pathname, asRoute.query, asRoute.hash);
        }
        // Compare pathnames before they are parsed (e.g. /path/1 !== /path/2 but /path/[id] === /path/[id])
        const rawPathnamesDiffer = (asRoute === null || asRoute === void 0 ? void 0 : asRoute.pathname) !== newRoute.pathname;
        // Optionally apply dynamic routes (can mutate routes)
        this.events.emit("NEXT_ROUTER_MOCK:parse", newRoute);
        if (asRoute) {
            this.events.emit("NEXT_ROUTER_MOCK:parse", asRoute);
        }
        const shallow = (options === null || options === void 0 ? void 0 : options.shallow) || false;
        // Fire "start" event:
        const triggerHashChange = shouldTriggerHashChange(this, newRoute);
        if (triggerHashChange) {
            this.events.emit("hashChangeStart", asPath, { shallow });
        }
        else {
            this.events.emit("routeChangeStart", asPath, { shallow });
        }
        // Simulate the async nature of this method
        if (async)
            await new Promise((resolve) => setTimeout(resolve, 0));
        // Update this instance:
        this.asPath = asPath;
        if (asRoute) {
            this.pathname = asRoute.pathname;
            this.query = rawPathnamesDiffer ? asRoute.query : newRoute.query;
            this.hash = asRoute.hash;
        }
        else {
            this.pathname = newRoute.pathname;
            this.query = newRoute.query;
            this.hash = newRoute.hash;
        }
        if (options === null || options === void 0 ? void 0 : options.locale) {
            this.locale = options.locale;
        }
        // Fire "complete" event:
        if (triggerHashChange) {
            this.events.emit("hashChangeComplete", this.asPath, { shallow });
        }
        else {
            this.events.emit("routeChangeComplete", this.asPath, { shallow });
        }
        // Fire internal events:
        const eventName = source === "push" ? "NEXT_ROUTER_MOCK:push" : source === "replace" ? "NEXT_ROUTER_MOCK:replace" : undefined;
        if (eventName)
            this.events.emit(eventName, this.asPath, { shallow });
        return true;
    }
}
exports.MemoryRouter = MemoryRouter;
/**
 * Normalizes the url or urlObject into a UrlObjectComplete.
 */
function parseUrlToCompleteUrl(url, currentPathname) {
    var _a;
    const parsedUrl = typeof url === "object" ? url : url_1.parse(url, true);
    return {
        pathname: removeTrailingSlash((_a = parsedUrl.pathname) !== null && _a !== void 0 ? _a : currentPathname),
        query: parsedUrl.query || {},
        hash: parsedUrl.hash || "",
    };
}
/**
 * Creates a URL from a pathname + query.
 * Injects query params into the URL slugs, the same way that next/router does.
 */
function getRouteAsPath(pathname, query, hash) {
    const remainingQuery = Object.assign({}, query);
    // Replace slugs, and remove them from the `query`
    let asPath = pathname.replace(/\[{1,2}(.+?)]{1,2}/g, ($0, slug) => {
        if (slug.startsWith("..."))
            slug = slug.replace("...", "");
        const value = remainingQuery[slug];
        delete remainingQuery[slug];
        if (Array.isArray(value)) {
            return value.map((v) => encodeURIComponent(v)).join("/");
        }
        return value !== undefined ? encodeURIComponent(String(value)) : "";
    });
    // Remove any trailing slashes; this can occur if there is no match for a catch-all slug ([[...slug]])
    asPath = removeTrailingSlash(asPath);
    // Append remaining query as a querystring, if needed:
    const qs = querystring_1.stringify(remainingQuery);
    if (qs)
        asPath += `?${qs}`;
    if (hash)
        asPath += hash;
    return asPath;
}
function removeTrailingSlash(path) {
    return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}
function shouldTriggerHashChange(current, newRoute) {
    const isHashChange = current.hash !== newRoute.hash;
    const isQueryChange = querystring_1.stringify(current.query) !== querystring_1.stringify(newRoute.query);
    const isRouteChange = isQueryChange || current.pathname !== newRoute.pathname;
    /**
     * Try to replicate NextJs routing behaviour:
     *
     * /foo       -> routeChange
     * /foo#baz   -> hashChange
     * /foo#baz   -> hashChange
     * /foo       -> hashChange
     * /foo       -> routeChange
     * /bar#fuz   -> routeChange
     */
    return !isRouteChange && (isHashChange || newRoute.hash);
}
//# sourceMappingURL=MemoryRouter.js.map