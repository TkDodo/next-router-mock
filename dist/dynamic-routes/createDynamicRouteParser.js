"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
/**
 * The only differences between Next 10/11/12 is the import paths,
 * so this "factory" function allows us to abstract these dependencies.
 */
function factory(dependencies) {
    checkDependencies(dependencies);
    const { 
    //
    getSortedRoutes, getRouteMatcher, getRouteRegex, isDynamicRoute, normalizePagePath, } = dependencies;
    return function createDynamicRouteParser(paths) {
        const matchers = getSortedRoutes(paths.map((path) => normalizePagePath(path))).map((path) => ({
            pathname: path,
            match: getRouteMatcher(getRouteRegex(path)),
        }));
        return function parser(url) {
            const pathname = url.pathname;
            const isDynamic = isDynamicRoute(pathname);
            const matcher = matchers.find((matcher) => matcher.match(pathname));
            if (matcher) {
                // Mutate the url:
                url.pathname = matcher.pathname;
                // When pushing to a dynamic route with un-interpolated slugs passed in the pathname, the assumption is that
                // a query dictionary will be provided, so instead of using the match we interpolate the route from
                // the provided query:
                if (!isDynamic) {
                    const match = matcher.match(pathname);
                    url.query = Object.assign(Object.assign({}, url.query), match);
                }
            }
        };
    };
}
exports.factory = factory;
/**
 * Check that all these dependencies are properly defined
 */
function checkDependencies(dependencies) {
    const missingDependencies = Object.keys(dependencies).filter((name) => {
        return !dependencies[name];
    });
    if (missingDependencies.length) {
        throw new Error(`next-router-mock/dynamic-routes: the following dependencies are missing: ${JSON.stringify(missingDependencies)}`);
    }
}
//# sourceMappingURL=createDynamicRouteParser.js.map