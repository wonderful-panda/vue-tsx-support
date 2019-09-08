import Vue, { VNode } from "vue";
import * as tsx from "vue-tsx-support";

function standardComponent() {
    const MyComponent = tsx.component({
        props: {
            foo: { type: String, required: true as true },
            bar: Number
        },
        render(): VNode {
            return <span>{this.foo}</span>;
        }
    });

    /* OK */
    <MyComponent foo="foo" bar={0} />;
    // bar is optional
    <MyComponent foo="foo" />;
    <MyComponent { ...{ props: { foo: "foo", bar: 0 } } } />; //// TS2322: 'foo' is missing

    const MyComponent2 = tsx.withPropsObject(MyComponent);
    /* OK */
    <MyComponent2 foo="foo" bar={0} />;
    <MyComponent2 foo="foo" />;
    <MyComponent2 { ...{ props: { foo: "foo", bar: 0 } } } />;
    <MyComponent2 { ...{ props: { foo: "foo" } } } />;
    <MyComponent2 { ...{ props: { bar: 0 } } } />;  //// TS2322: 'foo' is missing
}

