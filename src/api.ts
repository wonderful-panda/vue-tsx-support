///<reference path="../types/base.d.ts" />
import Vue, { ComponentOptions, FunctionalComponentOptions, CreateElement, VNode, RenderContext } from "vue";

export type VueClass<T> = {
    new (...args: any[]): T;
    prototype: T;
} & typeof Vue;

export declare interface TSXRenderContext<Props> extends RenderContext {
   props: Props;
}
    
export declare type TsxFunctionalComponentOptions<Props> =
    FunctionalComponentOptions<Props> &
    { render(this: undefined, createElement: CreateElement, context: TSXRenderContext<Props>): VNode };

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> = VueTsx.TsxComponentAttrs<TProps, TEvents, TScopedSlots>;

export type TsxComponent<V extends Vue, TProps = {}, TEvents = {}, TScopedSlots = {}> = VueClass<V & {
    _tsxattrs: TsxComponentAttrs<TProps, TEvents, TScopedSlots>
}>;

export class Component<TProps, TEvents = {}, TScopedSlots = {}> extends Vue {
    _tsxattrs: TsxComponentAttrs<TProps, TEvents, TScopedSlots>;
    $scopedSlots: VueTsx.ScopedSlots<TScopedSlots>;
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export declare function functionalComponent<TProps>(opts: TsxFunctionalComponentOptions<TProps>): TsxComponent<Vue, TProps>;

export function createComponent<TProps, TEvents = {}, TScopedSlots = {}>(opts: ComponentOptions<Vue>): TsxComponent<Vue, TProps, TEvents, TScopedSlots> {
    return Vue.extend(opts as any) as any;
}

export interface Factory<TProps, TEvents, TScopedSlots> {
    convert<V extends Vue>(componentType: VueClass<V>): TsxComponent<V, TProps, TEvents, TScopedSlots>;
    extend: {
        <V extends Vue, P, E, S>(componentType: TsxComponent<V, P, E, S>): TsxComponent<V, P & TProps, E & TEvents, S & TScopedSlots>;
        <P, E, S, C extends Component<P, E, S>>(componentType: VueClass<C & Component<P, E, S>>): TsxComponent<C, P & TProps, E & TEvents, S & TScopedSlots>;
    }
}

const factoryImpl = {
    convert: (c: any) => c,
    extend: (c: any) => c
};

/**
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.ofType<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
export function ofType<TProps, TEvents = {}, TScopedSlots = {}>(): Factory<TProps, TEvents, TScopedSlots> {
    return factoryImpl;
}


export function withNativeOn<V extends Vue, P, E, S>(componentType: TsxComponent<V, P, E, S>): TsxComponent<V, P, E & VueTsxDOM.EventsNativeOn, S>;
export function withNativeOn<P, E, S, C extends Component<P, E, S>>(componentType: VueClass<C & Component<P, E, S>>): TsxComponent<C, P, E & VueTsxDOM.EventsNativeOn, S>;
export function withNativeOn(componentType: any): any {
    return componentType;
}

export function withHtmlAttrs<V extends Vue, P, E, S>(componentType: TsxComponent<V, P, E, S>): TsxComponent<V, P & VueTsxDOM.AllHTMLAttributes, E, S>;
export function withHtmlAttrs<P, E, S, C extends Component<P, E, S>>(componentType: VueClass<C & Component<P, E, S>>): TsxComponent<C, P & VueTsxDOM.AllHTMLAttributes, E, S>;
export function withHtmlAttrs(componentType: any): any {
    return componentType;
}

export function withUnknownProps<V extends Vue, P, E, S>(componentType: TsxComponent<V, P, E, S>): TsxComponent<V, P & { [key: string]: any }, E, S>;
export function withUnknownProps<P, E, S, C extends Component<P, E, S>>(componentType: VueClass<C & Component<P, E, S>>): TsxComponent<C, P & { [key: string]: any }, E, S>;
export function withUnknownProps(componentType: any): any {
    return componentType;
}

