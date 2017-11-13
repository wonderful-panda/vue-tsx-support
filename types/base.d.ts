import * as dom from "./dom";
import Vue, { VNode, VNodeData, VNodeChildrenArrayContents } from "vue";

export type KnownAttrs = Pick<VNodeData, "class" | "staticClass" | "style" | "key" | "ref" | "slot" | "scopedSlots" > & {
    id?: string,
    refInFor?: boolean
};
export type ScopedSlots<T> = {
    [K in keyof T]: (props: T[K]) => VNodeChildrenArrayContents | string;
} & {
    [name: string]: (props: any) => VNodeChildrenArrayContents | string;
};

export interface ComponentAdditionalAttrs {
    // extension point.
}
export interface ElementAdditionalAttrs {
    // extension point.
}

export type EventHandlers<E> = {
    [K in keyof E]?: (payload: E[K]) => void;
}

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> = (
    { props: TProps } &
    Partial<TProps> &
    KnownAttrs &
    { scopedSlots?: ScopedSlots<TScopedSlots> } &
    EventHandlers<TEvents> &
    ComponentAdditionalAttrs
) | (
    TProps &
    KnownAttrs &
    { scopedSlots?: ScopedSlots<TScopedSlots> } &
    EventHandlers<TEvents> &
    ComponentAdditionalAttrs
);

export type ElementAttrs<T> = (
    T &
    KnownAttrs &
    EventHandlers<dom.EventsOn> &
    ElementAdditionalAttrs
);

export interface Element extends VNode {
}

export interface ElementClass extends Vue {
}

export interface ElementAttributesProperty {
    _tsxattrs: any;
}

export type IntrinsicElements = {
    [K in keyof dom.IntrinsicElementAttributes]: ElementAttrs<dom.IntrinsicElementAttributes[K]>
};

