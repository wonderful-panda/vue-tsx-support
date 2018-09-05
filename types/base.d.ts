import * as dom from "./dom";
import Vue, { VNode, VNodeData, VNodeChildrenArrayContents } from "vue";
import { ScopedSlot } from "vue/types/vnode";
import { RecordPropsDefinition } from "vue/types/options";

declare global {
  namespace VueTsx {
    export interface ComponentAdditionalAttrs {
      // extension point.
    }
    export interface ElementAdditionalAttrs {
      // extension point.
    }
  }
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type KnownAttrs = Pick<
  VNodeData,
  "class" | "staticClass" | "key" | "ref" | "slot"
> & {
  style?: VNodeData["style"] | string;
  id?: string;
  refInFor?: boolean;
  domPropsInnerHTML?: string;
};
export type TypedScopedSlot<T> = (
  props: T
) => VNodeChildrenArrayContents | string;

export type ScopedSlots<T> = { [K in StringKeyOf<T>]: TypedScopedSlot<T[K]> };

export type EventHandler<T> = T extends Function ? T : (payload: T) => void;
export type EventHandlers<E> = { [K in StringKeyOf<E>]?: EventHandler<E[K]> };
export type AllEventHandlers<E> = { [K in StringKeyOf<E>]: EventHandler<E[K]> };

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> =
  | ({ props: TProps } & Partial<TProps> &
      KnownAttrs &
      ({} extends TScopedSlots
        ? { scopedSlots?: VNodeData["scopedSlots"] }
        : { scopedSlots: TScopedSlots }) &
      EventHandlers<TEvents> &
      VueTsx.ComponentAdditionalAttrs)
  | (TProps &
      KnownAttrs &
      ({} extends TScopedSlots
        ? { scopedSlots?: VNodeData["scopedSlots"] }
        : { scopedSlots: TScopedSlots }) &
      EventHandlers<TEvents> &
      VueTsx.ComponentAdditionalAttrs);

export type ElementAttrs<T> = T &
  KnownAttrs &
  EventHandlers<dom.EventsOn> &
  VueTsx.ElementAdditionalAttrs;

export interface Element extends VNode {}

export interface ElementClass extends Vue {}

export interface ElementAttributesProperty {
  __tsxattrs: any;
}

export type IntrinsicElements = {
  [K in StringKeyOf<dom.IntrinsicElementAttributes>]: ElementAttrs<
    dom.IntrinsicElementAttributes[K]
  >
};

export type RequiredPropNames<PD extends RecordPropsDefinition<any>> = ({
  [K in StringKeyOf<PD>]: PD[K] extends { required: true } ? K : never
})[StringKeyOf<PD>] &
  StringKeyOf<PD>;

export type OuterProps<
  PD extends RecordPropsDefinition<any>,
  RequiredProps extends StringKeyOf<PD> = RequiredPropNames<PD>
> = PD extends RecordPropsDefinition<infer P>
  ? { [K in Extract<StringKeyOf<P>, RequiredProps>]: P[K] } &
      { [K in Exclude<StringKeyOf<P>, RequiredProps>]?: P[K] }
  : {};
