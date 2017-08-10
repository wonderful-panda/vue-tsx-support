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

        interface ElementEvents {
            click: Event;
            dblclick: Event;
            keydown: KeyboardEvent;
            keyup: KeyboardEvent;
            keypress: KeyboardEvent;
            // TODO: Add other events
        }

        interface ElementEventsNativeOn {
            nativeOnClick: Event;
            nativeOnDblclick: Event;
            nativeOnKeydown: KeyboardEvent;
            nativeOnKeyup: KeyboardEvent;
            nativeOnKeypress: KeyboardEvent;
            // TODO: Add other events
        }

        type TsxComponentAttrs<Props = {}, Events = {}> = (
            { props: Partial<Props> } &
            Partial<Props> &
            Vue.VNodeData &
            EventHandlers<Events> &
            EventHandlers<ElementEventsNativeOn> &
            AddtionalAttrs &
            { [name: string]: any } // allow unknown property
        ) | (
            Props &
            Vue.VNodeData &
            EventHandlers<Events> &
            EventHandlers<ElementEventsNativeOn> &
            AddtionalAttrs &
            { [name: string]: any } // allow unknown property
        );
    }
}
