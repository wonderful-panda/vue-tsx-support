import * as dom from "./dom";
import Vue, {
  VNode,
  VNodeData,
  VNodeChildrenArrayContents,
  ComponentOptions,
  VueConstructor
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

export type Arg1<T> = T extends ((arg1: infer A1) => any | undefined) ? A1 : never;

export type InnerScopedSlotReturnType = Vue["$scopedSlots"] extends {
  [name: string]: ((...args: any[]) => infer T) | undefined;
}
  ? T
  : never;
export type InnerScopedSlot<T> = (props: T) => InnerScopedSlotReturnType;
export type InnerScopedSlots<T> = { [K in keyof T]: InnerScopedSlot<Exclude<T[K], undefined>> };

export type ScopedSlotHandlers<InnerSSType> = {
  [K in keyof InnerSSType]: TypedScopedSlot<Arg1<InnerSSType[K]>>
};

export type EventHandler<E> = E extends (...args: any[]) => any ? E : (payload: E) => void;
export type EventHandlers<E> = { [K in keyof E]?: EventHandler<E[K]> };

export type DeclareProps<P> = { props: P };
export type DeclarePrefixedEvents<E> = { prefixedEvents: E };
export type DeclareOn<E> = { on: E };
export type DeclareAttributes<A> = { attributes: A };

export type TsxComponentTypeInfo<Attributes, Props, PrefixedEvents, On> = DeclareProps<Props> &
  DeclarePrefixedEvents<PrefixedEvents> &
  DeclareOn<On> &
  DeclareAttributes<Attributes>;

export type TsxTypeInfoOf<V> = V extends { _tsx: infer T } ? T : {};

export type PropsOf<T> = T extends DeclareProps<infer X> ? X : {};
export type PrefixedEventsOf<T> = T extends DeclarePrefixedEvents<infer X> ? X : {};
export type OnOf<T> = T extends DeclareOn<infer X> ? X : {};
export type AttributesOf<T> = T extends DeclareAttributes<infer X> ? X : {};

type CombinedTsxComponentAttrsOtherThanProps<Attributes, PrefixedEvents, On, InnerSS> = KnownAttrs &
  Attributes &
  EventHandlers<PrefixedEvents> & {
    on?: EventHandlers<On> & Record<string, Function>;
    scopedSlots?: ScopedSlotHandlers<InnerSS>;
  };

type CombinedTsxComponentAttrs<
  Attributes,
  Props,
  PrefixedEvents,
  On,
  InnerSS,
  AllowPropsObject extends boolean
> =
  | (AllowPropsObject extends true
      ? { props: Props } & Partial<Props> &
          CombinedTsxComponentAttrsOtherThanProps<Attributes, PrefixedEvents, On, InnerSS>
      : never)
  | Props & CombinedTsxComponentAttrsOtherThanProps<Attributes, PrefixedEvents, On, InnerSS>;

export type ElementAttrs<T> = T &
  KnownAttrs &
  EventHandlers<dom.EventsOn<T>> & {
    on?: EventHandlers<dom.Events<T>>;
  } & ElementAdditionalAttrs;

export interface Element extends VNode {}

export interface ElementClass extends Vue {}

export type IntrinsicElements = {
  [K in keyof dom.IntrinsicElementAttributes]: ElementAttrs<dom.IntrinsicElementAttributes[K]>
};

type ExcludedKey<V extends Vue = Vue> = keyof V | keyof ComponentOptions<Vue> | "_tsx";

export type DeclarePropsByNames<
  V extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Vue>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Vue>> = never
> = DeclareProps<Pick<V, Exclude<Names, ForceOptionals>> & Partial<Pick<V, ForceOptionals>>>;

export type DeclareExtendedComponentProps<
  V extends Parent,
  Parent extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Parent>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Parent>> = never
> = DeclareProps<Pick<V, Exclude<Names, ForceOptionals>> & Partial<Pick<V, ForceOptionals>>>;

export type DeclarePropsFromAllPublicMembers<
  V extends Parent,
  Parent extends Vue,
  Excludes extends Exclude<keyof V, ExcludedKey<Parent>> = never,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Parent> | Excludes> = never
> = DeclareProps<
  Pick<V, Exclude<keyof V, ForceOptionals | Excludes | ExcludedKey<Parent>>> &
    Partial<Pick<V, ForceOptionals>>
>;
