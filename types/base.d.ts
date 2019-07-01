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
export type ScopedSlots<T> = {
  [K in keyof T]: TypedScopedSlot<Exclude<T[K], undefined>>
};

export type InnerScopedSlotReturnType = Vue["$scopedSlots"] extends {
  [name: string]: ((...args: any[]) => infer T) | undefined;
}
  ? T
  : never;
export type InnerScopedSlot<T> = (props: T) => InnerScopedSlotReturnType;
export type InnerScopedSlots<T> = {
  [K in keyof T]: InnerScopedSlot<Exclude<T[K], undefined>>
};

export type EventHandlers<E> = {
  [K in keyof E]?: E[K] extends Function ? E[K] : (payload: E[K]) => void
};

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> =
  | ({ props: TProps } & Partial<TProps> &
      KnownAttrs & {
        scopedSlots?: ScopedSlots<TScopedSlots>;
      } & EventHandlers<TEvents>)
  | (TProps &
      KnownAttrs & {
        scopedSlots?: ScopedSlots<TScopedSlots>;
      } & EventHandlers<TEvents>);

export type ElementAttrs<T> = T &
  KnownAttrs &
  EventHandlers<dom.EventsOn<T>> &
  ElementAdditionalAttrs;

export interface Element extends VNode {}

export interface ElementClass extends Vue {}

export type IntrinsicElements = {
  [K in keyof dom.IntrinsicElementAttributes]: ElementAttrs<
    dom.IntrinsicElementAttributes[K]
  >
};

export type TsxKey = "$tsx";
type ExcludedKey<V extends Vue = Vue> =
  | keyof V
  | keyof ComponentOptions<Vue>
  | TsxKey;

export type DefineAttrs<
  V extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Vue>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Vue>> = never
> =
  | {
      attrs: Pick<V, Exclude<Names, ForceOptionals>> &
        Partial<Pick<V, ForceOptionals>>;
    }
  | undefined;

export type DefineExtendedComponentAttrs<
  V extends Parent,
  Parent extends Vue,
  Names extends Exclude<keyof V, ExcludedKey<Parent>>,
  ForceOptionals extends Exclude<keyof V, ExcludedKey<Parent>> = never
> =
  | ({
      attrs: Pick<V, Exclude<Names, ForceOptionals>> &
        Partial<Pick<V, ForceOptionals>>;
    } & (Parent extends { $tsx: infer PA } ? PA : {}))
  | undefined;

export type ExposeAllPublicMembers<
  V extends Parent,
  Parent extends Vue,
  Excludes extends Exclude<keyof V, ExcludedKey<Parent>> = never,
  ForceOptionals extends Exclude<
    keyof V,
    ExcludedKey<Parent> | Excludes
  > = never
> =
  | ({
      attrs: Pick<
        V,
        Exclude<keyof V, ForceOptionals | Excludes | ExcludedKey<Parent>>
      > &
        Partial<Pick<V, ForceOptionals>>;
    } & (Parent extends { $tsx: infer PA } ? PA : {}))
  | undefined;

export type ClassComponentAttrs<Inst> = Inst extends {
  $tsx: infer Metadata | undefined;
}
  ? Metadata extends { attrs: infer A } ? A : {}
  : {};

export type Arg1<T> = T extends ((arg1: infer A1) => any | undefined)
  ? A1
  : never;

export type ClassComponentScopedSlots<Inst> = Inst extends {
  $scopedSlots: infer SS;
}
  ? {
      scopedSlots?: { [K in keyof SS]: TypedScopedSlot<Arg1<SS[K]>> };
    }
  : {};
