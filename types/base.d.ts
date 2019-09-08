import * as dom from "./dom";
import Vue, {
  VNode,
  VNodeData,
  VNodeChildrenArrayContents,
  ComponentOptions
} from "vue";
import { ScopedSlot } from "vue/types/vnode";

export interface ElementAdditionalAttrs {
  // extension point.
}

export type ScopedSlotReturnType = ReturnType<ScopedSlot>;
export type TypedScopedSlot<P> = (props: P) => ScopedSlotReturnType;

export type KnownAttrs = {
  class?: VNodeData["class"];
  staticClass?: VNodeData["staticClass"];
  key?: VNodeData["key"];
  ref?: VNodeData["ref"];
  slot?: VNodeData["slot"];
  style?: VNodeData["style"] | string;
  id?: string;
  refInFor?: boolean;
  domPropsInnerHTML?: string;
};

export type Arg1<T> = T extends ((arg1: infer A1) => any | undefined)
  ? A1
  : never;

export type InnerScopedSlotReturnType = Vue["$scopedSlots"] extends {
  [name: string]: ((...args: any[]) => infer T) | undefined;
}
  ? T
  : never;
export type InnerScopedSlot<T> = (props: T) => InnerScopedSlotReturnType;
export type InnerScopedSlots<T> = {
  [K in keyof T]: InnerScopedSlot<Exclude<T[K], undefined>>
};

export type ScopedSlotHandlers<InnerSSType> = {
  [K in keyof InnerSSType]: TypedScopedSlot<Arg1<InnerSSType[K]>>
};

export type EventHandler<E> = E extends (...args: any[]) => any
  ? E
  : (payload: E) => void;
export type EventHandlers<E> = { [K in keyof E]?: EventHandler<E[K]> };

export type TsxComponentTypeInfo<Props, Events, On, NativeOn> = {
  props: Props;
  prefixedEvents: Events;
  on: On;
  nativeOn: NativeOn;
};

type CombinedTsxComponentAttrsOtherThanProps<
  Events,
  On,
  NativeOn,
  InnerSS
> = KnownAttrs &
  EventHandlers<Events> & {
    on?: EventHandlers<On>;
    nativeOn?: EventHandlers<NativeOn>;
    scopedSlots?: ScopedSlotHandlers<InnerSS>;
  };

type CombinedTsxComponentAttrs<
  Props,
  Events,
  On,
  NativeOn,
  InnerSS,
  AllowPropsObject extends boolean
> =
  | (AllowPropsObject extends true
      ? { props: Props } & Partial<Props> &
          CombinedTsxComponentAttrsOtherThanProps<Events, On, NativeOn, InnerSS>
      : never)
  | Props &
      CombinedTsxComponentAttrsOtherThanProps<Events, On, NativeOn, InnerSS>;

export type ElementAttrs<T> = T &
  KnownAttrs &
  EventHandlers<dom.EventsOn<T>> & {
    on?: EventHandlers<dom.Events<T>>;
  } & ElementAdditionalAttrs;

export interface Element extends VNode {}

export interface ElementClass extends Vue {}

export type IntrinsicElements = {
  [K in keyof dom.IntrinsicElementAttributes]: ElementAttrs<
    dom.IntrinsicElementAttributes[K]
  >
};

type ExcludedKey<V extends Vue = Vue> =
  | keyof V
  | keyof ComponentOptions<Vue>
  | "_tsx";

export type DefineProps<
  V extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Vue>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Vue>> = never
> = {
  props: Pick<V, Exclude<Names, ForceOptionals>> &
    Partial<Pick<V, ForceOptionals>>;
};

export type DefineExtendedComponentProps<
  V extends Parent,
  Parent extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Parent>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Parent>> = never
> = {
  props: Pick<V, Exclude<Names, ForceOptionals>> &
    Partial<Pick<V, ForceOptionals>>;
} & (Parent extends { _tsx: infer PA } ? PA : {});

export type ExposeAllPublicMembers<
  V extends Parent,
  Parent extends Vue,
  Excludes extends Exclude<keyof V, ExcludedKey<Parent>> = never,
  ForceOptionals extends Exclude<
    keyof V,
    ExcludedKey<Parent> | Excludes
  > = never
> = {
  props: Pick<
    V,
    Exclude<keyof V, ForceOptionals | Excludes | ExcludedKey<Parent>>
  > &
    Partial<Pick<V, ForceOptionals>>;
} & (Parent extends { _tsx: infer PA } ? PA : {});

export type DefineEvents<T> = { on: T };
