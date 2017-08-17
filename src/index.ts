///<reference path="../types/base.d.ts" />
///<reference path="../types/vue.d.ts" />
import Vue from "vue";

export type TsxComponentAttrs<Props = {}, Events = {}> = VueTsx.TsxComponentAttrs<Props, Events>;

export type TsxComponent<V extends Vue, Props, Events> = VueTsx.Constructor<V & {
    _tsxattrs: VueTsx.TsxComponentAttrs<Props, Events>
}>;

/**
 * Add TSX-support to existing component factory
 */
export function convert<V extends Vue>(component: VueTsx.Constructor<V>): TsxComponent<V, {}, {}> {
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
export function of<Props, Events = {}>(): { convert: <V extends Vue>(component: VueTsx.Constructor<V>) => TsxComponent<V, Props, Events> } {
    return { convert: ((c: Vue) => c) as any };
}

/**
 * Create component from component options (Compatible with Vue.extend)
 */
export function createComponent<Props = {}, Events = {}>(opts: VueTsx.ComponentOptions<Props> | Vue.FunctionalComponentOptions): TsxComponent<Vue, Props, Events> {
    return Vue.extend(opts) as any;
}

export class Component<Props = {}, Events = {}> extends Vue {
    _tsxattrs: VueTsx.TsxComponentAttrs<Props, Events>;
}
