import * as dom from "./dom";
import Vue, { VNode, VNodeData, VNodeChildrenArrayContents } from "vue";

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

export type KnownAttrs = Pick<VNodeData, "class" | "staticClass" | "key" | "ref" | "slot" | "scopedSlots" > & {
    style?: VNodeData["style"] | string;
    id?: string,
    refInFor?: boolean
};
export type ScopedSlots<T> = {
    [K in StringKeyOf<T>]: (props: T[K]) => VNodeChildrenArrayContents | string;
} & {
    [name: string]: (props: any) => VNodeChildrenArrayContents | string;
};

export type EventHandlers<E> = {
    [K in StringKeyOf<E>]?: E[K] extends Function ? E[K] : (payload: E[K]) => void;
}

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> = (
    { props: TProps } &
    Partial<TProps> &
    KnownAttrs &
    { scopedSlots?: ScopedSlots<TScopedSlots> } &
    EventHandlers<TEvents> &
    VueTsx.ComponentAdditionalAttrs
) | (
    TProps &
    KnownAttrs &
    { scopedSlots?: ScopedSlots<TScopedSlots> } &
    EventHandlers<TEvents> &
    VueTsx.ComponentAdditionalAttrs
);

export type ElementAttrs<T> = (
    T &
    KnownAttrs &
    EventHandlers<dom.EventsOn> &
    VueTsx.ElementAdditionalAttrs
);

export interface Element extends VNode {
}

export interface ElementClass extends Vue {
}

export interface ElementAttributesProperty {
    _tsxattrs: any;
}

export type IntrinsicElements = {
    [K in StringKeyOf<dom.IntrinsicElementAttributes>]: ElementAttrs<dom.IntrinsicElementAttributes[K]>
};

