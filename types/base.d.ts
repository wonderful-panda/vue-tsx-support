import * as dom from "./dom";
import Vue, { VNode, VNodeData, VNodeChildrenArrayContents } from "vue";
import { ScopedSlot } from "vue/types/vnode";

export interface ElementAdditionalAttrs {
  // extension point.
}

export type ScopedSlotReturnType = ReturnType<ScopedSlot>;

export type KnownAttrs = Pick<
  VNodeData,
  "class" | "staticClass" | "key" | "ref" | "slot" | "scopedSlots"
> & {
  style?: VNodeData["style"] | string;
  id?: string;
  refInFor?: boolean;
  domPropsInnerHTML?: string;
};
export type ScopedSlots<T> = {
  [K in keyof T]: (props: Exclude<T[K], undefined>) => ScopedSlotReturnType
};

export type InnerScopedSlotReturnType = Vue["$scopedSlots"] extends {
  [name: string]: ((...args: any[]) => infer T) | undefined;
}
  ? T
  : never;
export type InnerScopedSlot<T> = (props: T) => InnerScopedSlotReturnType;

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

export type PropMarker = { __vuetsx_type: "prop" };
export type PropOf<T> = T & PropMarker;
// prettier-ignore
export type RawPropType<T> =
  unknown extends T
  ? never
  : T extends PropOf<infer X>
    ? PropMarker extends T ? unknown : X
    : never;

export type ClassComponentPropNames<C> = {
  [K in keyof C]: RawPropType<C[K]> extends never ? never : K
}[keyof C];

export type ClassComponentProps<C> = Pick<
  { [K in keyof C]: RawPropType<C[K]> },
  ClassComponentPropNames<C>
>;
