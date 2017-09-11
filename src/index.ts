///<reference path="../types/base.d.ts" />
///<reference path="../types/vue.d.ts" />
import Vue from "vue";

export type VueClass<T> = {
    new (...args: any[]): T;
    prototype: T;
} & typeof Vue;

export type TsxComponentAttrs<Props = {}, Events = {}> = VueTsx.TsxComponentAttrs<Props, Events>;

export type TsxComponent<V extends Vue, Props, Events> = VueClass<V & {
    _tsxattrs: VueTsx.TsxComponentAttrs<Props, Events>
}>;

export class Component<Props, Events = {}> extends Vue {
    _tsxattrs: VueTsx.TsxComponentAttrs<Props, Events>;
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<Props, Events = {}>(opts: Vue.ComponentOptions<Vue> | Vue.FunctionalComponentOptions): TsxComponent<Vue, Props, Events> {
    return Vue.extend(opts) as any;
}

export interface Factory<Props, Events> {
    convert<V extends Vue>(componentType: VueClass<V>): TsxComponent<V, Props, Events>;
    extend: {
        <V extends Vue, P, E>(componentType: TsxComponent<V, P, E>): TsxComponent<V, P & Props, E & Events>;
        <P, E, C extends Component<P, E>>(componentType: VueClass<C & Component<P, E>>): TsxComponent<C, P & Props, E & Events>;
    }
}

const factoryImpl = {
    convert: (c: any) => c, extend: (c: any) => c
};

/**
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.ofType<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
export function ofType<Props, Events = {}>(): Factory<Props, Events> {
    return factoryImpl;
}
