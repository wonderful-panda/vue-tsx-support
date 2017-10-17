import "./dom";
import Vue, { VNode, VNodeData, VNodeChildrenArrayContents } from "vue";

declare global {
    namespace VueTsx {
        type KnownAttrs = Pick<VNodeData, "class" | "staticClass" | "style" | "key" | "ref" | "slot" | "scopedSlots" > & {
            id?: string,
            refInFor?: boolean
        };
        type ScopedSlots<T> = {
            [K in keyof T]: (props: T[K]) => VNodeChildrenArrayContents | string;
        } & {
            [name: string]: (props: any) => VNodeChildrenArrayContents | string;
        };

        interface ComponentAdditionalAttrs {
            // extension point.
        }
        interface ElementAdditionalAttrs {
            // extension point.
        }

        type EventHandlers<E> = {
            [K in keyof E]?: (payload: E[K]) => void;
        }

        type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> = (
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

        type ElementAttrs<T> = (
            T &
            KnownAttrs &
            EventHandlers<VueTsxDOM.EventsOn> &
            ElementAdditionalAttrs
        );

        interface Element extends VNode {
        }

        interface ElementClass extends Vue {
        }

        interface ElementAttributesProperty {
            _tsxattrs: any;
        }

        type IntrinsicElements = {
            [K in keyof VueTsxDOM.IntrinsicElementAttributes]: ElementAttrs<VueTsxDOM.IntrinsicElementAttributes[K]>
        };
    }
}
