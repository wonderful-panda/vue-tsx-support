import "./base";
import Vue from "vue";

export type Constructor<T> = new (...args: any[]) => T;

export type PropType = Constructor<any> | Constructor<any>[] | null;
export type PropsDefinition<PropKeys extends string> = {
    [K in PropKeys]: Vue.PropOptions | PropType;
};
export type ComponentOptions<Props> = Vue.ComponentOptions<Vue> & {
    props?: PropsDefinition<keyof Props> | string[]
};

export type EventHandlers<E> = {
    [K in keyof E]?: (payload: E[K]) => void;
}

export interface ElementEvents {
    click: Event;
    dblclick: Event;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    keypress: KeyboardEvent;
    // TODO: Add other events
}

export interface ElementEventsNativeOn {
    nativeOnClick: Event;
    nativeOnDblclick: Event;
    nativeOnKeydown: KeyboardEvent;
    nativeOnKeyup: KeyboardEvent;
    nativeOnKeypress: KeyboardEvent;
    // TODO: Add other events
}

export type TsxComponentAttrs<Props, Events> = (
    { props: Partial<Props> } &
    Partial<Props> &
    Vue.VNodeData &
    EventHandlers<Events> &
    EventHandlers<ElementEventsNativeOn> &
    VueTsxSupport.AddtionalAttrs
) | (
    Props &
    Vue.VNodeData &
    EventHandlers<Events> &
    EventHandlers<ElementEventsNativeOn> &
    VueTsxSupport.AddtionalAttrs
);

export type TsxComponent<V extends Vue, Props, Events> = Constructor<V & {
    _tsxattrs: TsxComponentAttrs<Props, Events>
}>;

/**
 * Add TSX-support to existing component factory
 */
export function convert<V extends Vue>(component: Constructor<V>): TsxComponent<V, any, {}> {
    return component as any;
}

/**
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with no props and events
 *  const NewComponent = tsx.convert(Component);
 *
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.of<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
export function of<Props, Events = {}>(): { convert: <V extends Vue>(component: Constructor<V>) => TsxComponent<V, Props, Events> } {
    return { convert: ((c: Vue) => c) as any };
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<Props = any, Events = {}>(opts: ComponentOptions<Props> | Vue.FunctionalComponentOptions): TsxComponent<Vue, Props, Events> {
    return Vue.extend(opts) as any;
}

export class Component<Props = any, Events = {}> extends Vue {
    _tsxattrs: TsxComponentAttrs<Props, Events>;
}
