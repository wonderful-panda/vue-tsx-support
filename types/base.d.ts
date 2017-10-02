import "./dom";
import Vue from "vue";

declare global {
    namespace VueTsx {
        interface VNodeData {
            class?: Vue.VNodeData["class"];
            staticClass?: Vue.VNodeData["staticClass"];
            style?: Vue.VNodeData["style"];
            key?: Vue.VNodeData["key"];
            ref?: Vue.VNodeData["ref"];
            refInFor?: boolean;
            slot?: Vue.VNodeData["slot"];
            scopedSlots?: Vue.VNodeData["scopedSlots"];
        }
        type ScopedSlots<T> = {
            [K in keyof T]: (props: T[K]) => Vue.VNodeChildrenArrayContents | string;
        } & {
            [name: string]: (props: any) => Vue.VNodeChildrenArrayContents | string;
        };

        interface ComponentAdditionalAttrs {
            // extension point.
            id?: string;
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
            VNodeData &
            { scopedSlots?: ScopedSlots<TScopedSlots> } &
            EventHandlers<TEvents> &
            ComponentAdditionalAttrs
        ) | (
            TProps &
            VNodeData &
            { scopedSlots?: ScopedSlots<TScopedSlots> } &
            EventHandlers<TEvents> &
            ComponentAdditionalAttrs
        );

        type ElementAttrs<T> = (
            T &
            VNodeData &
            EventHandlers<VueTsxDOM.EventsOn> &
            ElementAdditionalAttrs
        );

        interface Element extends Vue.VNode {
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
