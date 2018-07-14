import Vue, { ComponentOptions, FunctionalComponentOptions, VueConstructor } from "vue";
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
    _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs> = undefined as any;
    $scopedSlots: ScopedSlots<ScopedSlotArgs> = undefined as any;
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

// If props is
//   `{ foo: String, bar: String, baz: { type: String, required: true as true} }`
// then, `RequiredPropNames<typeof props>` is "baz",
export type RequiredPropNames<PropsDef extends RecordPropsDefinition<any>> = ({
    [K in keyof PropsDef]: PropsDef[K] extends { required: true } ? K : never
})[keyof PropsDef];

export type PropsForOutside<Props, RequiredPropNames extends keyof Props> = { [K in RequiredPropNames]: Props[K] } &
    { [K in Exclude<keyof Props, RequiredPropNames>]?: Props[K] };

export interface ComponentFactory<BaseProps, EventsWithOn, ScopedSlotArgs, AdditionalThisAttrs, Super extends Vue> {
    create<
        Props,
        PropsDef extends RecordPropsDefinition<Props>,
        RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
    >(
        options: FunctionalComponentOptions<Props, PropsDef & RecordPropsDefinition<Props>>,
        requiredProps?: RequiredProps[]
    ): TsxComponent<Super, PropsForOutside<Props, RequiredProps> & BaseProps, EventsWithOn, ScopedSlotArgs, Props>;

    create<
        Data,
        Methods,
        Computed,
        Props,
        PropsDef extends RecordPropsDefinition<Props>,
        RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
    >(
        options: ThisTypedComponentOptions<AdditionalThisAttrs & Super & Vue, Data, Methods, Computed, Props> & {
            props?: PropsDef;
        },
        requiredPropsNames?: RequiredProps[]
    ): TsxComponent<
        Super,
        PropsForOutside<Props, RequiredProps> & BaseProps,
        EventsWithOn,
        ScopedSlotArgs,
        Data & Methods & Computed & Props
    >;

    mixin<Data, Methods, Computed, Props>(
        mixinObject: ThisTypedComponentOptions<Vue, Data, Methods, Computed, Props>
    ): ComponentFactory<
        BaseProps & Props,
        EventsWithOn,
        ScopedSlotArgs,
        AdditionalThisAttrs & Data & Methods & Computed & Props,
        Super
    >;

    mixin<P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(
        mixinObject: VueConstructor<C>
    ): ComponentFactory<
        BaseProps & P,
        EventsWithOn & E,
        ScopedSlotArgs & S,
        AdditionalThisAttrs & { $scopedSlots: ScopedSlots<ScopedSlotArgs & S> },
        C & Super & Vue
    >;

    mixin<C extends Vue>(
        mixinObject: VueConstructor<C>
    ): ComponentFactory<BaseProps, EventsWithOn, ScopedSlotArgs, AdditionalThisAttrs, C & Super & Vue>;
}

export interface ExtendableComponentFactory<
    BaseProps,
    EventsWithOn,
    ScopedSlotArgs,
    AdditionalThisAttrs,
    Super extends Vue
> extends ComponentFactory<BaseProps, EventsWithOn, ScopedSlotArgs, AdditionalThisAttrs, Super> {
    extendFrom<P, E, S, C extends TsxComponentInstance<Vue, P, E, S>>(
        componentType: Constructor<C>
    ): ComponentFactory<
        BaseProps & P,
        EventsWithOn & E,
        ScopedSlotArgs & S,
        AdditionalThisAttrs & { $scopedSlots: ScopedSlots<ScopedSlotArgs & S> },
        C
    >;

    extendFrom<C extends Vue>(
        componentType: Constructor<C>
    ): ComponentFactory<BaseProps, EventsWithOn, ScopedSlotArgs, AdditionalThisAttrs, C>;
}

function createComponentFactory(base: typeof Vue, mixins: any[]): ComponentFactory<any, any, any, any, Vue> {
    return {
        create(options: any): any {
            const mergedMixins = options.mixins ? [...options.mixins, ...mixins] : mixins;
            return base.extend({ ...options, mixins: mergedMixins });
        },
        mixin(mixinObject: any): any {
            return createComponentFactory(base, [...mixins, mixinObject]);
        }
    };
}

function createExtendableComponentFactory(): ExtendableComponentFactory<any, any, any, any, Vue> {
    return {
        create(options: any): any {
            return Vue.extend(options);
        },
        extendFrom(base: typeof Vue): any {
            return createComponentFactory(base, []);
        },
        mixin(mixinObject: any): any {
            return createComponentFactory(Vue, [mixinObject]);
        }
    };
}

export const componentFactory: ExtendableComponentFactory<{}, {}, {}, {}, Vue> = createExtendableComponentFactory();

export function componentFactoryOf<EventsWithOn = {}, ScopedSlotArgs = {}>(): ComponentFactory<
    {},
    EventsWithOn,
    ScopedSlotArgs,
    { $scopedSlots: ScopedSlots<ScopedSlotArgs> },
    Vue
> {
    return componentFactory as any;
}

/**
 * Shorthand of `componentFactory.create`
 */
export const component = componentFactory.create;
export const extendFrom = componentFactory.extendFrom;
