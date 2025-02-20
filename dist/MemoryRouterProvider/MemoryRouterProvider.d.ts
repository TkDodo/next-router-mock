import React, { ReactNode } from "react";
import { Url } from "../index";
import { MemoryRouterEventHandlers } from "../useMemoryRouter";
declare type AbstractedNextDependencies = {
    RouterContext: typeof import("next/dist/shared/lib/router-context").RouterContext;
};
export declare type MemoryRouterProviderProps = {
    /** The initial URL to render */
    url?: Url;
    async?: boolean;
    children?: ReactNode;
} & MemoryRouterEventHandlers;
export declare function factory(dependencies: AbstractedNextDependencies): React.FC<MemoryRouterProviderProps>;
export {};
