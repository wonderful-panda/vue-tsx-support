import * as vuetsx from "vue-tsx-support";
import Vue, { VNode, VNodeChildrenArrayContents, VNodeData } from "vue";
import { VueConstructor } from "vue/types/vue";

// export component with --declaration

export const Component = vuetsx.component({
    name: "Component",
    props: {
        foo: String
    },
    render(h): VNode {
        return <div>{this.foo}</div>;
    }
});

export const FunctionalComponent = vuetsx.component({
    functional: true,
    name: "Component2",
    props: {
        foo: String
    },
    render(h, { props }): VNode {
        return <div>{props.foo}</div>;
    }
});


export class ClassComponent extends vuetsx.Component<{ foo: string }, { onClick: string }, { default: string }> {
}
