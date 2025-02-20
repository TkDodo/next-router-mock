/// <reference types="node" />
import { MittEmitter } from "./lib/mitt";
import { UrlWithParsedQuery } from "url";
import type { NextRouter, RouterEvent } from "next/router";
export declare type Url = string | UrlObject;
export declare type UrlObject = {
    pathname?: UrlWithParsedQuery["pathname"];
    query?: UrlWithParsedQuery["query"];
    hash?: UrlWithParsedQuery["hash"];
};
export declare type UrlObjectComplete = {
    pathname: NonNullable<UrlWithParsedQuery["pathname"]>;
    query: NonNullable<UrlWithParsedQuery["query"]>;
    hash: NonNullable<UrlWithParsedQuery["hash"]>;
};
interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
}
declare type InternalEventTypes = "NEXT_ROUTER_MOCK:parse" | "NEXT_ROUTER_MOCK:push" | "NEXT_ROUTER_MOCK:replace";
/**
 * A base implementation of NextRouter that does nothing; all methods throw.
 */
export declare abstract class BaseRouter implements NextRouter {
    isReady: boolean;
    route: string;
    pathname: string;
    hash: string;
    query: NextRouter["query"];
    asPath: string;
    basePath: string;
    isFallback: boolean;
    isPreview: boolean;
    isLocaleDomain: boolean;
    locale: NextRouter["locale"];
    locales: NextRouter["locales"];
    defaultLocale?: NextRouter["defaultLocale"];
    domainLocales?: NextRouter["domainLocales"];
    events: MittEmitter<RouterEvent | InternalEventTypes>;
    abstract push(url: Url, as?: Url, options?: TransitionOptions): Promise<boolean>;
    abstract replace(url: Url): Promise<boolean>;
    back(): void;
    beforePopState(): void;
    prefetch(): Promise<void>;
    reload(): void;
}
/**
 * An implementation of NextRouter that does not change the URL, but just stores the current route in memory.
 */
export declare class MemoryRouter extends BaseRouter {
    static snapshot(original: MemoryRouter): Readonly<MemoryRouter>;
    constructor(initialUrl?: Url, async?: boolean);
    /**
     * When enabled, there will be a short delay between calling `push` and when the router is updated.
     * This is used to simulate Next's async behavior.
     * However, for most tests, it is more convenient to leave this off.
     */
    async: boolean;
    /**
     * This method was removed in v0.7.0.
     * It has been replaced with "mockRouter.useParser(createDynamicRouteParser(...))"
     * See the README for more details on upgrading.
     * @deprecated
     */
    registerPaths: {
        ["This method has been replaced"]: "See the README for more details on upgrading";
    };
    useParser(parser: (urlObject: UrlObjectComplete) => void): () => void;
    push: (url: Url, as?: string | UrlObject | undefined, options?: TransitionOptions | undefined) => Promise<boolean>;
    replace: (url: Url, as?: string | UrlObject | undefined, options?: TransitionOptions | undefined) => Promise<boolean>;
    /**
     * Sets the current Memory route to the specified url, synchronously.
     */
    setCurrentUrl: (url: Url, as?: string | UrlObject | undefined) => void;
    private _setCurrentUrl;
}
export {};
