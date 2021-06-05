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
  ref?: VNodeData["ref"] | { value: unknown };
  slot?: VNodeData["slot"];
  style?: VNodeData["style"] | string;
  domProps?: VNodeData["domProps"];
  attrs?: VNodeData["attrs"];
  hook?: VNodeData["hook"];
  on?: VNodeData["on"];
  nativeOn?: VNodeData["nativeOn"];
  id?: string;
  refInFor?: boolean;
  domPropsInnerHTML?: string;
};

export type Arg1<T> = T extends (arg1: infer A1) => any | undefined ? A1 : never;

export type InnerScopedSlotReturnType = Vue["$scopedSlots"] extends {
  [name: string]: ((...args: any[]) => infer T) | undefined;
}
  ? T
  : never;
export type InnerScopedSlot<T> = (props: T) => InnerScopedSlotReturnType;
export type InnerScopedSlots<T> = { [K in keyof T]: InnerScopedSlot<Exclude<T[K], undefined>> };

export type ScopedSlotHandlers<InnerSSType> = {
  [K in keyof InnerSSType]: TypedScopedSlot<Arg1<InnerSSType[K]>>;
};

export type EventHandler<E> = [E] extends [(...args: any[]) => any] ? E : (payload: E) => void;
export type EventHandlers<E> = { [K in keyof E]?: EventHandler<E[K]> | EventHandler<E[K]>[] };

export type DeclareProps<P> = { props: P };
export type DeclareOnEvents<E> = { onEvents: E };
export type DeclareOn<E> = { events: E };
export type DeclareAttributes<A> = { attributes: A };

export type TsxComponentTypeInfo<Attributes, Props, PrefixedEvents, On> = DeclareProps<Props> &
  DeclareOnEvents<PrefixedEvents> &
  DeclareOn<On> &
  DeclareAttributes<Attributes>;

export type TsxTypeInfoOf<V> = V extends { _tsx: infer T } ? T : {};

export type PropsOf<V> = TsxTypeInfoOf<V> extends DeclareProps<infer X> ? X : {};
export type PrefixedEventsOf<V> = TsxTypeInfoOf<V> extends DeclareOnEvents<infer X> ? X : {};
export type OnOf<V> = TsxTypeInfoOf<V> extends DeclareOn<infer X> ? X : {};
export type AttributesOf<V> = TsxTypeInfoOf<V> extends DeclareAttributes<infer X> ? X : {};
export type IsPropsObjectAllowed<V> = V extends { _tsx_allowPropsObject: true } ? true : false;

type CombinedTsxComponentAttrsOtherThanProps<Attributes, PrefixedEvents, On, InnerSS> = KnownAttrs &
  Attributes &
  EventHandlers<PrefixedEvents> & {
    on?: EventHandlers<On> & VNodeData["on"];
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
  | (Props & CombinedTsxComponentAttrsOtherThanProps<Attributes, PrefixedEvents, On, InnerSS>);

export type ElementAttrs<E extends dom.ElementType> = E[1] &
  KnownAttrs &
  EventHandlers<dom.EventsOn<E[0]>> & {
    on?: EventHandlers<dom.Events<E[0]>>;
  } & ElementAdditionalAttrs;

export interface Element extends VNode {}

export interface ElementClass extends Vue {}

export type IntrinsicElements = {
  [K in keyof dom.IntrinsicElementTypes]: ElementAttrs<dom.IntrinsicElementTypes[K]>;
};

type PropNameCandidates<V extends Parent, Parent extends Vue = Vue> = Exclude<
  keyof V,
  keyof Parent | keyof ComponentOptions<Vue> | "_tsx"
>;

export type PickProps<V extends Vue, Names extends PropNameCandidates<V, Vue>> = Pick<V, Names>;
export type PickOwnProps<
  V extends Parent,
  Parent extends Vue,
  Names extends PropNameCandidates<V, Parent>
> = Pick<V, Names>;
export type AutoProps<V extends Parent, Parent extends Vue = Vue> = Pick<
  V,
  PropNameCandidates<V, Parent>
>;
export type MakeOptional<P, Optionals extends keyof P> = Omit<P, Optionals> &
  Partial<Pick<P, Optionals>>;
