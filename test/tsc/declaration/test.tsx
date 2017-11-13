import * as vuetsx from "vue-tsx-support";
import { ComponentAdditionalAttrs } from "vue-tsx-support";
import Vue, { VNode, VNodeChildrenArrayContents, VNodeData } from "vue";
import { VueConstructor } from "vue/types/vue";

const noop = () => {};

export const Component1 = vuetsx.component({
    functional: true,
    name: "Component1",
    props: {
        foo: String
    },
    render(h, ctx): VNode {
        return <div>{ctx.props.foo}</div>;
    }
});


export class Component2 extends vuetsx.Component<{ foo: string }, { onClick: string }, { default: string }> {
}
