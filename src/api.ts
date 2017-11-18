import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";
import { VueConstructor } from "vue/types/vue";
import {
    RecordPropsDefinition,
    ThisTypedComponentOptionsWithRecordProps as ThisTypedComponentOptions
} from "vue/types/options";

import { TsxComponentAttrs, ScopedSlots } from "../types/base";
export { TsxComponentAttrs, ScopedSlots } from "../types/base";
import { EventsNativeOn, AllHTMLAttributes } from "../types/dom";
export { EventsNativeOn, AllHTMLAttributes } from "../types/dom";

export type Constructor<T> = {
    new (...args: any[]): T;
};

export type TsxComponentInstance<V extends Vue, Props, EventsWithOn, ScopedSlotArgs> = {
    _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs>;
} & (V & Vue);

export type TsxComponent<
    V extends Vue,
    Props = {},
    EventsWithOn = {},
    ScopedSlotArgs = {},
    AdditionalThisAttrs = {}
> = VueConstructor<TsxComponentInstance<V, Props, EventsWithOn, ScopedSlotArgs> & AdditionalThisAttrs>;

export class Component<Props, EventsWithOn = {}, ScopedSlotArgs = {}> extends Vue {
    _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs>;
    $scopedSlots: ScopedSlots<ScopedSlotArgs>;
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
    convert<V extends Vue>(componentType: Constructor<V>): TsxComponent<V, TProps, TEvents, TScopedSlots>;
    extendFrom: {
        <P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(componentType: Constructor<C>): TsxComponent<
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

export function withNativeOn<P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(
    componentType: Constructor<C>
): TsxComponent<C, P, E & EventsNativeOn, S> {
    return componentType as any;
}

export function withHtmlAttrs<P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(
    componentType: Constructor<C>
): TsxComponent<C, P & AllHTMLAttributes, E, S> {
    return componentType as any;
}

export function withUnknownProps<P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(
    componentType: Constructor<C>
): TsxComponent<C, P & { [key: string]: any }, E, S> {
    return componentType as any;
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
    ): TsxComponent<Vue, Partial<Props>, EventsWithOn, ScopedSlotArgs, Props>;

    create<Props, RequiredPropNames extends keyof Props = never>(
        definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>,
        requiredPropsNames?: RequiredPropNames[]
    ): TsxComponent<Vue, PropsForOutside<Props, RequiredPropNames>, EventsWithOn, ScopedSlotArgs, Props>;

    create<Data, Methods, Computed, Props>(
        options: ThisTypedComponentOptions<AdditionalThisAttrs & Vue, Data, Methods, Computed, Props>
    ): TsxComponent<Vue, Partial<Props>, EventsWithOn, ScopedSlotArgs, Data & Methods & Computed & Props>;

    create<Data, Methods, Computed, Props, RequiredPropNames extends keyof Props = never>(
        options: ThisTypedComponentOptions<AdditionalThisAttrs & Vue, Data, Methods, Computed, Props>,
        requiredPropsNames?: RequiredPropNames[]
    ): TsxComponent<
        Vue,
        PropsForOutside<Props, RequiredPropNames>,
        EventsWithOn,
        ScopedSlotArgs,
        Data & Methods & Computed & Props
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
