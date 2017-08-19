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
        interface AddtionalAttrs {
        }

        type Constructor<T> = new (...args: any[]) => T;

        type PropType = Constructor<any> | Constructor<any>[] | null;
        type PropsDefinition<PropKeys extends string> = {
            [K in PropKeys]: Vue.PropOptions | PropType;
        };
        type ComponentOptions<Props> = Vue.ComponentOptions<Vue> & {
            props?: PropsDefinition<keyof Props> | string[]
        };

        type EventHandlers<E> = {
            [K in keyof E]?: (payload: E[K]) => void;
        }

        type TsxComponentAttrs<Props = {}, Events = {}> = (
            { props: Partial<Props> } &
            Partial<Props> &
            Vue.VNodeData &
            EventHandlers<Events> &
            EventHandlers<VueTsxDOM.EventsNativeOn> &
            AddtionalAttrs &
            { [name: string]: any } // allow unknown property
        ) | (
            Props &
            Vue.VNodeData &
            EventHandlers<Events> &
            EventHandlers<VueTsxDOM.EventsNativeOn> &
            AddtionalAttrs &
            { [name: string]: any } // allow unknown property
        );

        type ElementAttrs<T> = (
            T &
            Vue.VNodeData &
            EventHandlers<VueTsxDOM.EventsOn> &
            { [name: string]: any } // allow unknown property
        );

        type IntrinsicElements = {
            [K in keyof VueTsxDOM.IntrinsicElementAttributes]: ElementAttrs<VueTsxDOM.IntrinsicElementAttributes[K]>
        };
    }
}
