import { MemoryRouter } from "./MemoryRouter";
import { WithRouterProps } from "./withMemoryRouter";
import { NextComponentType, NextPageContext } from "next";
export { useMemoryRouter } from "./useMemoryRouter";
export { MemoryRouter, BaseRouter, Url } from "./MemoryRouter";
export declare const memoryRouter: MemoryRouter;
export default memoryRouter;
export declare const useRouter: () => Readonly<MemoryRouter>;
export declare const withRouter: <P extends WithRouterProps, C = NextPageContext>(ComposedComponent: NextComponentType<C, any, P>) => NextComponentType<C, any, Pick<P, Exclude<keyof P, "router">>>;
