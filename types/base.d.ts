import "./dom";
import "./builtin-components";
import Vue from "vue";

declare global {
    namespace JSX {
        interface Element extends Vue.VNode {
        }

        interface ElementClass extends Vue {
        }

        interface ElementAttributesProperty {
            _tsxattrs: any;
        }

        interface IntrinsicElements extends VueTsx.IntrinsicElements {
            // allow unknown elements
            [name: string]: any;

            // builtin components
            transition: VueTsx.TsxComponentAttrs<VueTsxBuiltin.TransitionProps>;
            "transition-group": VueTsx.TsxComponentAttrs<VueTsxBuiltin.TransitionGroupProps>;
            "keep-alive": VueTsx.TsxComponentAttrs<VueTsxBuiltin.KeepAliveProps>;
        }
    }

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
        interface ComponentAdditionalAttrs {
            // extension point.
            id?: string;
        }
        interface ElementAdditionalAttrs {
            // extension point.
        }

        type Constructor<T> = new (...args: any[]) => T;

        type PropType = Constructor<any> | Constructor<any>[] | null;

        type EventHandlers<E> = {
            [K in keyof E]?: (payload: E[K]) => void;
        }

        type TsxComponentAttrs<Props = {}, Events = {}> = (
            { props: Props } &
            Partial<Props> &
            VNodeData &
            EventHandlers<Events> &
            ComponentAdditionalAttrs
        ) | (
            Props &
            VNodeData &
            EventHandlers<Events> &
            ComponentAdditionalAttrs
        );

        type ElementAttrs<T> = (
            T &
            VNodeData &
            EventHandlers<VueTsxDOM.EventsOn> &
            ElementAdditionalAttrs
        );

        type IntrinsicElements = {
            [K in keyof VueTsxDOM.IntrinsicElementAttributes]: ElementAttrs<VueTsxDOM.IntrinsicElementAttributes[K]>
        };
    }
}
