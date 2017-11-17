import { VNode } from "vue";
import * as tsx from "vue-tsx-support";

function standardComponent() {
    const MyComponent = tsx.component({
        props: {
            foo: String,
            bar: Number,
            baz: String
        },
        render(): VNode {
            return <span>{this.foo}</span>;
        }
    }, /* requiredPropNames */ ["foo", "bar"]);

    /* OK */
    <MyComponent foo="foo" bar={0} baz="baz" />;
    // baz is optional
    <MyComponent foo="foo" bar={0} />;
    // other known attributes
    <MyComponent foo="foo" bar={0} key="xxx" id="xxx" />;

    /* NG */
    <MyComponent />;                    //// TS2322: Property 'foo' is missing
    <MyComponent foo="foo" />;          //// TS2322: Property 'bar' is missing
    <MyComponent foo={0} bar={1} />;    //// TS2322: '0' is not assignable
    <MyComponent foo="foo" bar="bar" />;        //// TS2322: '"bar"' is not assignable
    <MyComponent foo="foo" bar={0} baz={1} />;  //// TS2322: '1' is not assignable
    <MyComponent foo="foo" bar={0} unknown="unknown" />;    //// TS2339: Property 'unknown' does not exist
}

function functionalComponent() {
    const MyComponent = tsx.component({
        functional: true,
        props: {
            foo: String,
            bar: Number,
            baz: String
        },
        render(_h, ctx): VNode {
            return <span>{ctx.props.foo}</span>;
        }
    }, ["foo", "bar"]);
    /* OK */
    <MyComponent foo="foo" bar={0} baz="baz" />;
    // baz is optional
    <MyComponent foo="foo" bar={0} />;
    // other known attributes
    <MyComponent foo="foo" bar={0} key="xxx" id="xxx" />;

    /* NG */
    <MyComponent />;                    //// TS2322: Property 'foo' is missing
    <MyComponent foo="foo" />;          //// TS2322: Property 'bar' is missing
    <MyComponent foo={0} bar={1} />;    //// TS2322: '0' is not assignable
    <MyComponent foo="foo" bar="bar" />;        //// TS2322: '"bar"' is not assignable
    <MyComponent foo="foo" bar={0} baz={1} />;  //// TS2322: '1' is not assignable
    <MyComponent foo="foo" bar={0} unknown="unknown" />;    //// TS2339: Property 'unknown' does not exist
}

function withoutRequiredPropNames() {
    const MyComponent = tsx.componentFactory.create({
        props: {
            foo: String,
            bar: Number,
            baz: String
        },
        render(): VNode {
            return <span>{this.foo}</span>;
        }
    });

    /* OK */
    <MyComponent foo="foo" bar={0} baz="baz" />;
    // foo, bar, baz are all optional
    <MyComponent />;
    // other known attributes
    <MyComponent key="xxx" id="xxx" />;

    /* NG */
    <MyComponent foo={0} />;            //// TS2322: '0' is not assignable
    <MyComponent bar="bar" />;          //// TS2322: '"bar"' is not assignable
    <MyComponent baz={1} />;            //// TS2322: '1' is not assignable
    <MyComponent unknown="unknown" />;  //// TS2339: P
}

function withWrongRequiredPropNames() {
    const MyComponent = tsx.componentFactory.create({
        props: {
            foo: String,
            bar: Number,
            baz: String
        },
        render(): VNode {
            return <span>{this.foo}</span>;
        }
    }, ["foo", "unknown"]);    //// TS2345: '"unknown"' is not assignable
}

function componentFactoryOf() {
    const factory = tsx.componentFactoryOf<{ onChange: number }, { content: string }>();
    const MyComponent = factory.create({
        props: {
            foo: String,
            bar: Number
        },
        computed: {
            okNode(): VNode {
                return <div>{this.$scopedSlots.content("foo")}</div>;
            },
            ngNode(): VNode {
                return <div>{this.$scopedSlots.content(0)}</div>;       //// TS2345: '0' is not assignable
            }
        },
        render(): VNode {
            return <div>{[this.okNode, this.ngNode]}</div>;
        },
    });

    /* checking type of scopedSlots */
    <MyComponent scopedSlots={{ content: p => p }} />;
    <MyComponent scopedSlots={{ content: p => p, unknown: (p: any) => p }} />;
    <MyComponent scopedSlots={{ content: (p: number) => p.toString() }} />; //// TS2322: 'string' is not assignable
    <MyComponent scopedSlots={{}} />;           //// TS2322: Property 'content' is missing

    /* checking type of custom event handler */
    <MyComponent onChange={_v => {}} />;
    <MyComponent onChange={(_v: number) => {}} />;
    <MyComponent onChange={(_v: string) => {}} />; //// TS2322: 'number' is not assignable
}
