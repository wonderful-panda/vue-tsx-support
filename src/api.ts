import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";
import { ExtendedVue, CombinedVueInstance, VueConstructor } from "vue/types/vue";
import { RecordPropsDefinition, ThisTypedComponentOptionsWithRecordProps } from "vue/types/options";

import { TsxComponentAttrs, ScopedSlots } from "../types/base";
export { TsxComponentAttrs, ScopedSlots } from "../types/base";
import { EventsNativeOn, AllHTMLAttributes } from "../types/dom";
export { EventsNativeOn, AllHTMLAttributes } from "../types/dom";

export type VueClass<T> = {
    new (...args: any[]): T;
    prototype: T;
} & typeof Vue;

export type TsxComponentInstance<Props, EventsWithOn, ScopedSlotArgs> = {
    _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs>;
};

export type TsxComponent<V extends Vue, TProps = {}, TEvents = {}, TScopedSlots = {}> = VueClass<
    V & TsxComponentInstance<TProps, TEvents, TScopedSlots>
>;

export class Component<TProps, TEvents = {}, TScopedSlots = {}> extends Vue {
    _tsxattrs: TsxComponentAttrs<TProps, TEvents, TScopedSlots>;
    $scopedSlots: ScopedSlots<TScopedSlots>;
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<TProps, TEvents = {}, TScopedSlots = {}>(
    opts: ComponentOptions<Vue> | FunctionalComponentOptions
): TsxComponent<Vue, TProps, TEvents, TScopedSlots> {
    return Vue.extend(opts as any) as any;
}

export interface Factory<TProps, TEvents, TScopedSlots> {
    convert<V extends Vue>(componentType: VueClass<V>): TsxComponent<V, TProps, TEvents, TScopedSlots>;
    extendFrom: {
        <V extends Vue, P, E, S>(componentType: TsxComponent<V, P, E, S>): TsxComponent<
            V,
            P & TProps,
            E & TEvents,
            S & TScopedSlots
        >;
        <P, E, S, C extends Component<P, E, S>>(componentType: VueClass<C & Component<P, E, S>>): TsxComponent<
            C,
            P & TProps,
            E & TEvents,
            S & TScopedSlots
        >;
    };
}

const factoryImpl = {
    convert: (c: any) => c,
    extendFrom: (c: any) => c
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

export function withNativeOn<V extends Vue, P, E, S>(
    componentType: TsxComponent<V, P, E, S>
): TsxComponent<V, P, E & EventsNativeOn, S>;
export function withNativeOn<P, E, S, C extends Component<P, E, S>>(
    componentType: VueClass<C & Component<P, E, S>>
): TsxComponent<C, P, E & EventsNativeOn, S>;
export function withNativeOn(componentType: any): any {
    return componentType;
}

export function withHtmlAttrs<V extends Vue, P, E, S>(
    componentType: TsxComponent<V, P, E, S>
): TsxComponent<V, P & AllHTMLAttributes, E, S>;
export function withHtmlAttrs<P, E, S, C extends Component<P, E, S>>(
    componentType: VueClass<C & Component<P, E, S>>
): TsxComponent<C, P & AllHTMLAttributes, E, S>;
export function withHtmlAttrs(componentType: any): any {
    return componentType;
}

export function withUnknownProps<V extends Vue, P, E, S>(
    componentType: TsxComponent<V, P, E, S>
): TsxComponent<V, P & { [key: string]: any }, E, S>;
export function withUnknownProps<P, E, S, C extends Component<P, E, S>>(
    componentType: VueClass<C & Component<P, E, S>>
): TsxComponent<C, P & { [key: string]: any }, E, S>;
export function withUnknownProps(componentType: any): any {
    return componentType;
}

/**
 * Experimental support for new typings introduced from Vue 2.5
 * Depending on some private types of vue, which may be changed by upgrade :(
 */

export type PropsForOutside<PropsForInside, RequiredPropNames extends keyof PropsForInside> = {
    [K in RequiredPropNames]: PropsForInside[K]
} &
    Partial<PropsForInside>;

export interface ComponentFactory<EventsWithOn, ScopedSlotArgs, AdditionalThisAttrs> {
    create<Props>(
        definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>
    ): ExtendedVue<TsxComponentInstance<Partial<Props>, EventsWithOn, ScopedSlotArgs> & Vue, {}, {}, {}, Props>;

    create<Props, RequiredPropNames extends keyof Props = never>(
        definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>,
        requiredPropsNames?: RequiredPropNames[]
    ): ExtendedVue<
        TsxComponentInstance<PropsForOutside<Props, RequiredPropNames>, EventsWithOn, ScopedSlotArgs> & Vue,
        {},
        {},
        {},
        Props
    >;

    create<Data, Methods, Computed, Props>(
        options: ThisTypedComponentOptionsWithRecordProps<
            AdditionalThisAttrs & Vue,
            Data,
            Methods,
            Computed,
            Props
        >
    ): ExtendedVue<
        TsxComponentInstance<Partial<Props>, EventsWithOn, ScopedSlotArgs> & Vue,
        Data,
        Methods,
        Computed,
        Props
    >;

    create<Data, Methods, Computed, Props, RequiredPropNames extends keyof Props = never>(
        options: ThisTypedComponentOptionsWithRecordProps<
            AdditionalThisAttrs & Vue,
            Data,
            Methods,
            Computed,
            Props
        >,
        requiredPropsNames?: RequiredPropNames[]
    ): ExtendedVue<
        TsxComponentInstance<PropsForOutside<Props, RequiredPropNames>, EventsWithOn, ScopedSlotArgs> & Vue,
        Data,
        Methods,
        Computed,
        Props
    >;
}

export const componentFactory: ComponentFactory<{}, {}, {}> = {
    create(options: any): any {
        return Vue.extend(options);
    }
};

export function componentFactoryOf<EventsWithOn = {}, ScopedSlotArgs = {}>(): ComponentFactory<
    EventsWithOn,
    ScopedSlotArgs,
    { $scopedSlots: ScopedSlots<ScopedSlotArgs> }
> {
    return componentFactory as any;
}

/**
 * Shorthand of `componentFactory.create`
 */
export const component = componentFactory.create;
