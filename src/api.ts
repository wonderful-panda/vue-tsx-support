import Vue, {
  ComponentOptions,
  FunctionalComponentOptions,
  VueConstructor
} from "vue";
import {
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithRecordProps as ThisTypedComponentOptions
} from "vue/types/options";

import { TsxComponentAttrs, ScopedSlots, StringKeyOf } from "../types/base";
export { TsxComponentAttrs, ScopedSlots } from "../types/base";
import { EventsNativeOn, AllHTMLAttributes } from "../types/dom";
export { EventsNativeOn, AllHTMLAttributes } from "../types/dom";

export type TsxComponentInstance<
  V extends Vue,
  Props,
  EventsWithOn,
  ScopedSlotArgs
> = {
  _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs>;
} & (V & Vue);

export type TsxComponent<
  V extends Vue,
  Props = {},
  EventsWithOn = {},
  ScopedSlotArgs = {},
  AdditionalThisAttrs = {}
> = VueConstructor<
  TsxComponentInstance<V, Props, EventsWithOn, ScopedSlotArgs> &
    AdditionalThisAttrs
>;

export class Component<
  Props,
  EventsWithOn = {},
  ScopedSlotArgs = {}
> extends Vue {
  _tsxattrs: TsxComponentAttrs<
    Props,
    EventsWithOn,
    ScopedSlotArgs
  > = undefined as any;
  $scopedSlots: ScopedSlots<ScopedSlotArgs> = undefined as any;
}

/**
 * @deprecated use componentFactory.create instead
 *
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<TProps, TEvents = {}, TScopedSlots = {}>(
  opts: ComponentOptions<Vue> | FunctionalComponentOptions
): TsxComponent<Vue, TProps, TEvents, TScopedSlots> {
  return Vue.extend(opts as any) as any;
}

export interface Factory<TProps, TEvents, TScopedSlots> {
  // now, extendFrom is just alias of convert
  convert<VC extends typeof Vue>(
    componentType: VC
  ): TsxComponent<InstanceType<VC>, TProps, TEvents, TScopedSlots>;
  extendFrom<VC extends typeof Vue>(
      componentType: VC
    ): TsxComponent<InstanceType<VC>, TProps, TEvents, TScopedSlots>;
}

const factoryImpl = {
  convert: (c: any) => c,
  extendFrom: (c: any) => c
};

/**
 * @deprecated use componentFactoryOf<...> instead
 *
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.ofType<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
export function ofType<TProps, TEvents = {}, TScopedSlots = {}>(): Factory<
  TProps,
  TEvents,
  TScopedSlots
> {
  return factoryImpl;
}

export function withNativeOn<
  VC extends typeof Vue
>(componentType: VC): TsxComponent<InstanceType<VC>, {}, EventsNativeOn, {}> {
  return componentType as any;
}

export function withHtmlAttrs<
  VC extends typeof Vue
>(componentType: VC): TsxComponent<InstanceType<VC>, AllHTMLAttributes, {}, {}> {
  return componentType as any;
}

export function withUnknownProps<
  VC extends typeof Vue
>(
  componentType: VC
): TsxComponent<InstanceType<VC>, { [key: string]: any }, {}, {}> {
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
  [K in StringKeyOf<PropsDef>]: PropsDef[K] extends { required: true }
    ? K
    : never
})[StringKeyOf<PropsDef>];

export type PropsForOutside<
  Props,
  RequiredPropNames extends StringKeyOf<Props>
> = { [K in RequiredPropNames]: Props[K] } &
  { [K in Exclude<StringKeyOf<Props>, RequiredPropNames>]?: Props[K] };

export interface ComponentFactory<
  BaseProps,
  EventsWithOn,
  ScopedSlotArgs,
  AdditionalThisAttrs,
  Super extends Vue
> {
  create<
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends StringKeyOf<Props> = RequiredPropNames<PropsDef> &
      StringKeyOf<Props>
  >(
    options: FunctionalComponentOptions<
      Props,
      PropsDef & RecordPropsDefinition<Props>
    >,
    requiredProps?: RequiredProps[]
  ): TsxComponent<
    Super,
    PropsForOutside<Props, RequiredProps> & BaseProps,
    EventsWithOn,
    ScopedSlotArgs,
    Props
  >;

  create<
    Data,
    Methods,
    Computed,
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends StringKeyOf<Props> = RequiredPropNames<PropsDef> &
      StringKeyOf<Props>
  >(
    options: ThisTypedComponentOptions<
      AdditionalThisAttrs & Super & Vue,
      Data,
      Methods,
      Computed,
      Props
    > & {
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

  mixin<VC extends typeof Vue>(
    mixinObject: VC
  ): ComponentFactory<
    BaseProps,
    EventsWithOn,
    ScopedSlotArgs,
    AdditionalThisAttrs & { $scopedSlots: ScopedSlots<ScopedSlotArgs> },
    InstanceType<VC> & Super
  >;
}

export interface ExtendableComponentFactory<
  BaseProps,
  EventsWithOn,
  ScopedSlotArgs,
  AdditionalThisAttrs,
  Super extends Vue
>
  extends ComponentFactory<
      BaseProps,
      EventsWithOn,
      ScopedSlotArgs,
      AdditionalThisAttrs,
      Super
    > {
  extendFrom<VC extends typeof Vue>(
    componentType: VC
  ): ComponentFactory<
    BaseProps,
    EventsWithOn,
    ScopedSlotArgs,
    AdditionalThisAttrs & { $scopedSlots: ScopedSlots<ScopedSlotArgs> },
    InstanceType<VC>
  >;
}

function createComponentFactory(
  base: typeof Vue,
  mixins: any[]
): ComponentFactory<any, any, any, any, Vue> {
  return {
    create(options: any): any {
      const mergedMixins = options.mixins
        ? [...options.mixins, ...mixins]
        : mixins;
      return base.extend({ ...options, mixins: mergedMixins });
    },
    mixin(mixinObject: any): any {
      return createComponentFactory(base, [...mixins, mixinObject]);
    }
  };
}

function createExtendableComponentFactory(): ExtendableComponentFactory<
  any,
  any,
  any,
  any,
  Vue
> {
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

export const componentFactory: ExtendableComponentFactory<
  {},
  {},
  {},
  {},
  Vue
> = createExtendableComponentFactory();

export function componentFactoryOf<
  EventsWithOn = {},
  ScopedSlotArgs = {}
>(): ComponentFactory<
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
