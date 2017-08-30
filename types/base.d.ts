import "./dom";
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
        }
    }

    namespace VueTsx {
        interface ComponentAdditionalAttrs {
            // extension point.
            id?: string;
        }
        interface ElementAdditionalAttrs {
            // extension point.
        }

        type Constructor<T> = new (...args: any[]) => T;

        type PropType = Constructor<any> | Constructor<any>[] | null;
        type PropsDefinition<PropKeys extends string> = {
            [K in PropKeys]: Vue.PropOptions | PropType;
        };

        type EventHandlers<E> = {
            [K in keyof E]?: (payload: E[K]) => void;
        }

        type TsxComponentAttrs<Props extends object = {}, Events = {}> = (
            { props: Props } &
            Vue.VNodeData &
            EventHandlers<Events> &
            ComponentAdditionalAttrs
        ) | (
            Props &
            Vue.VNodeData &
            EventHandlers<Events> &
            ComponentAdditionalAttrs
        );

        type ElementAttrs<T> = (
            T &
            Vue.VNodeData &
            EventHandlers<VueTsxDOM.EventsOn> &
            ElementAdditionalAttrs
        );

        type IntrinsicElements = {
            [K in keyof VueTsxDOM.IntrinsicElementAttributes]: ElementAttrs<VueTsxDOM.IntrinsicElementAttributes[K]>
        };
    }
}
