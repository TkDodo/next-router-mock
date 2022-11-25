import type { UrlObjectComplete } from "../MemoryRouter";
declare type AbstractedNextDependencies = Pick<typeof import("next/dist/shared/lib/router/utils"), "getSortedRoutes" | "getRouteMatcher" | "getRouteRegex" | "isDynamicRoute"> & Pick<typeof import("next/dist/shared/lib/page-path/normalize-page-path"), "normalizePagePath">;
/**
 * The only differences between Next 10/11/12 is the import paths,
 * so this "factory" function allows us to abstract these dependencies.
 */
export declare function factory(dependencies: AbstractedNextDependencies): (paths: string[]) => (url: UrlObjectComplete) => void;
export {};
