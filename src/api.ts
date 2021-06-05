import Vue, { ComponentOptions, FunctionalComponentOptions, VueConstructor, VNodeData } from "vue";
import {
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithRecordProps as ThisTypedComponentOptions
} from "vue/types/options";

import {
  InnerScopedSlots,
  TsxComponentTypeInfo,
  EventHandler,
  EventHandlers,
  DeclareOnEvents,
  DeclareOn,
  DeclareProps
} from "../types/base";
import { EventsNativeOn, AllHTMLAttributes, Events } from "../types/dom";

export type _TsxComponentInstanceV3<
  V extends Vue,
  Attributes,
  Props,
  PrefixedEvents,
  On,
  ScopedSlotArgs
> = {
  _tsx: TsxComponentTypeInfo<Attributes, Props, PrefixedEvents, On>;
  $scopedSlots: InnerScopedSlots<ScopedSlotArgs>;
} & V;

export type _TsxComponentV3<
  V extends Vue,
  Attributes,
  Props,
  PrefixedEvents,
  On,
  ScopedSlotArgs
> = VueConstructor<
  _TsxComponentInstanceV3<V, Attributes, Props, PrefixedEvents, On, ScopedSlotArgs>
>;

export class Component<Props, PrefixedEvents = {}, ScopedSlotArgs = {}> extends Vue {
  _tsx!: TsxComponentTypeInfo<{}, Props, PrefixedEvents, {}>;
  $scopedSlots!: InnerScopedSlots<ScopedSlotArgs>;
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<TProps, TPrefixedEvents = {}, TScopedSlots = {}>(
  opts: ComponentOptions<Vue> | FunctionalComponentOptions
): _TsxComponentV3<Vue, {}, TProps, TPrefixedEvents, {}, TScopedSlots> {
  return Vue.extend(opts as any) as any;
}

export interface Factory<Props, PrefixedEvents, On, ScopedSlots> {
  convert<V extends Vue>(
    componentType: new (...args: any[]) => V
  ): _TsxComponentV3<V, {}, Props, PrefixedEvents, On, ScopedSlots>;
  extendFrom<VC extends typeof Vue>(
    componentType: VC
  ): _TsxComponentV3<InstanceType<VC>, {}, Props, PrefixedEvents, On, ScopedSlots> &
    Pick<VC, keyof VC>; // take over static members of component
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
export function ofType<Props, PrefixedEvents = {}, ScopedSlots = {}, On = {}>(): Factory<
  Props,
  PrefixedEvents,
  On,
  ScopedSlots
> {
  return factoryImpl;
}

export function withNativeOn<VC extends typeof Vue>(
  componentType: VC
): _TsxComponentV3<
  InstanceType<VC>,
  EventHandlers<EventsNativeOn> & { nativeOn?: EventHandlers<Events> & VNodeData["nativeOn"] },
  {},
  {},
  {},
  {}
> {
  return componentType as any;
}

export function withHtmlAttrs<VC extends typeof Vue>(
  componentType: VC
): _TsxComponentV3<InstanceType<VC>, AllHTMLAttributes, {}, {}, {}, {}> {
  return componentType as any;
}

export function withUnknownProps<VC extends typeof Vue>(
  componentType: VC
): _TsxComponentV3<InstanceType<VC>, Record<string, any>, {}, {}, {}, {}> {
  return componentType as any;
}

export function withPropsObject<VC extends typeof Vue>(
  componentType: VC
): _TsxComponentV3<
  InstanceType<VC> & {
    _tsx_allowPropsObject: true;
  },
  {},
  {},
  {},
  {},
  {}
> {
  return componentType as any;
}

/**
 * Experimental support for new typings introduced from Vue 2.5
 * Depending on some private types of vue, which may be changed by upgrade :(
 */

// If props is
//   `{ foo: String, bar: String, baz: { type: String, required: true as true} }`
// then, `RequiredPropNames<typeof props>` is "baz",
export type RequiredPropNames<PropsDef extends RecordPropsDefinition<any>> = {
  [K in keyof PropsDef]: PropsDef[K] extends { required: true } ? K : never;
}[Extract<keyof PropsDef, string>];

export type PropsForOutside<Props, RequiredPropNames extends keyof Props> = {
  [K in RequiredPropNames]: Props[K];
} &
  { [K in Exclude<keyof Props, RequiredPropNames>]?: Props[K] };

export interface ComponentFactory<
  BaseProps,
  PrefixedEvents,
  Events,
  ScopedSlotArgs,
  Super extends Vue
> {
  create<
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
  >(
    options: FunctionalComponentOptions<Props, PropsDef & RecordPropsDefinition<Props>>,
    requiredProps?: RequiredProps[]
  ): _TsxComponentV3<
    Super & Props,
    {},
    PropsForOutside<Props, RequiredProps> & BaseProps,
    PrefixedEvents,
    Events,
    ScopedSlotArgs
  >;

  create<
    Data,
    Methods,
    Computed,
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
  >(
    options: ThisTypedComponentOptions<
      Super &
        Vue & {
          _tsx?: DeclareProps<PropsForOutside<Props, RequiredProps> & BaseProps>;
        },
      Data,
      Methods,
      Computed,
      Props
    > & {
      props?: PropsDef;
    },
    requiredPropsNames?: RequiredProps[]
  ): _TsxComponentV3<
    Super & Data & Methods & Computed & Props,
    {},
    PropsForOutside<Props, RequiredProps> & BaseProps,
    PrefixedEvents,
    Events,
    ScopedSlotArgs
  >;

  mixin<Data, Methods, Computed, Props>(
    mixinObject: ThisTypedComponentOptions<Vue, Data, Methods, Computed, Props>
  ): ComponentFactory<
    BaseProps & Props,
    PrefixedEvents,
    Events,
    ScopedSlotArgs,
    Super & Data & Methods & Computed & Props
  >;

  mixin<VC extends typeof Vue>(
    mixinObject: VC
  ): ComponentFactory<
    BaseProps,
    PrefixedEvents,
    Events,
    ScopedSlotArgs,
    Super & InstanceType<VC> & { $scopedSlots: InnerScopedSlots<ScopedSlotArgs> }
  >;
}

export interface ExtendableComponentFactory<
  BaseProps,
  EventsWithPrefix,
  EventsWithoutPrefix,
  ScopedSlotArgs,
  Super extends Vue
> extends ComponentFactory<
    BaseProps,
    EventsWithPrefix,
    EventsWithoutPrefix,
    ScopedSlotArgs,
    Super
  > {
  extendFrom<VC extends typeof Vue>(
    componentType: VC
  ): ComponentFactory<
    BaseProps,
    EventsWithPrefix,
    EventsWithoutPrefix,
    ScopedSlotArgs,
    InstanceType<VC> & { $scopedSlots: InnerScopedSlots<ScopedSlotArgs> }
  >;
}

function createComponentFactory(
  base: typeof Vue,
  mixins: any[]
): ComponentFactory<any, any, any, any, Vue> {
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

export const componentFactory: ExtendableComponentFactory<
  {},
  {},
  {},
  {},
  Vue
> = createExtendableComponentFactory();

export function componentFactoryOf<
  PrefixedEvents = {},
  ScopedSlotArgs = {},
  On = {}
>(): ComponentFactory<
  {},
  PrefixedEvents,
  On,
  ScopedSlotArgs,
  Vue & {
    _tsx: TsxComponentTypeInfo<{}, {}, PrefixedEvents, On>;
    $scopedSlots: InnerScopedSlots<ScopedSlotArgs>;
  }
> {
  return componentFactory as any;
}

/**
 * Shorthand of `componentFactory.create`
 */
export const component = componentFactory.create;
export const extendFrom = componentFactory.extendFrom;

export function emit<Events, Name extends string & keyof Events>(
  vm: Vue & { _tsx: DeclareOn<Events> },
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  vm.$emit(name, ...args);
}

export function emitOn<Events, Name extends string & keyof Events>(
  vm: Vue & { _tsx: DeclareOnEvents<Events> },
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  vm.$emit(
    name.replace(/^on[A-Z]/, v => v[2].toLowerCase()),
    ...args
  );
}

export function emitUpdate<Props, Name extends string & keyof Props>(
  vm: Vue & { _tsx?: DeclareProps<Props> },
  name: Name,
  value: Props[Name]
) {
  vm.$emit("update:" + name, value);
}
