import type { NextComponentType, NextPageContext } from "next";
import type { NextRouter } from "next/router";
import { MemoryRouter } from "./MemoryRouter";
export declare type WithRouterProps = {
    router: NextRouter;
};
export declare type ExcludeRouterProps<P> = Pick<P, Exclude<keyof P, keyof WithRouterProps>>;
export declare function withMemoryRouter<P extends WithRouterProps, C = NextPageContext>(useRouter: () => Readonly<MemoryRouter>, ComposedComponent: NextComponentType<C, any, P>): NextComponentType<C, any, ExcludeRouterProps<P>>;
