import Vue from "vue";
import * as vuetsx from "vue-tsx-support";
import component from "vue-class-component";

const noop = () => {};

interface Props {
    foo: string;
}

interface Events {
    onOk: void;
}

interface Props2 {
    bar: string;
}

interface Events2 {
    onErr: string;
}

const a = { foo: 1, bar: "" };

function by_createComponent() {
    const Base = vuetsx.createComponent<Props, Events>({});

    // NG
    <Base />;   //// TS2322 | TS2326 | TS2769: 'foo' is missing
    // OK
    <Base foo="foo" onOk={ noop } />;
    // NG
    <Base foo="foo" bar="bar" />;   //// TS2322 | TS2339 | TS2769: Property 'bar' does not exist
    // NG
    <Base foo="foo" onErr={ noop } />;   //// TS2322 | TS2339 | TS2769: Property 'onErr' does not exist

    /* add more attributes */
    const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
    // OK
    <Extend foo="foo" bar="bar" onOk={ noop } onErr={ s => console.log(s) } />;
    // NG
    <Extend foo="foo" />;   //// TS2322 | TS2326 | TS2769: 'bar' is missing
    // NG
    <Extend bar="bar" />;   //// TS2322 | TS2326 | TS2769: 'foo' is missing

    const WithNativeOn = vuetsx.withNativeOn(Base);
    <WithNativeOn foo="foo" nativeOnClick={ noop } />;

    const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
    <WithHtmlAttrs foo="foo" accesskey="foo" />;

    const WithUnknownProps = vuetsx.withUnknownProps(Base);
    <WithUnknownProps foo="foo" unknown="foo" />;
}

function by_convert() {
    const Base = vuetsx.ofType<Props, Events>().convert(Vue.extend({}));

    /* add more attributes */
    const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
    // OK
    <Extend foo="foo" bar="bar" onOk={ noop } onErr={ s => console.log(s) } />;
    // NG
    <Extend foo="foo" />;   //// TS2322 | TS2326 | TS2769: 'bar' is missing
    // NG
    <Extend bar="bar" />;   //// TS2322 | TS2326 | TS2769: 'foo' is missing

    const WithNativeOn = vuetsx.withNativeOn(Base);
    <WithNativeOn foo="foo" nativeOnClick={ noop } />;

    const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
    <WithHtmlAttrs foo="foo" accesskey="foo" />;

    const WithUnknownProps = vuetsx.withUnknownProps(Base);
    <WithUnknownProps foo="foo" unknown="foo" />;
}

function by_class() {
    class Base extends vuetsx.Component<Props, Events> {
        someProp: string = "foo";
        someMethod() {
        }
    }

    /* add more attributes */
    const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
    // OK
    <Extend foo="foo" bar="bar" onOk={ noop } onErr={ s => console.log(s) } />;
    // NG
    <Extend foo="foo" />;   //// TS2322 | TS2326 | TS2769: 'bar' is missing
    // NG
    <Extend bar="bar" />;   //// TS2322 | TS2326 | TS2769: 'foo' is missing

    // Extend inherits prototype of Base.
    const ext = new Extend();
    console.log(ext.someProp, ext.someMethod());

    const WithNativeOn = vuetsx.withNativeOn(Base);
    <WithNativeOn foo="foo" nativeOnClick={ noop } />;
    console.log(new WithNativeOn().someProp);

    const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
    <WithHtmlAttrs foo="foo" accesskey="foo" />;
    console.log(new WithHtmlAttrs().someProp);

    const WithUnknownProps = vuetsx.withUnknownProps(Base);
    <WithUnknownProps foo="foo" unknown="foo" />;
    console.log(new WithUnknownProps().someProp);
}

function by_componentFactory() {
    const Base = vuetsx.componentFactoryOf<Events>().create({
        props: {
            foo: String
        },
        computed: {
            someProp(): string {
                return "";
            }
        },
        methods: {
            someMethod() {}
        }
    }, ["foo"]);

    /* add more attributes */
    const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
    // OK
    <Extend foo="foo" bar="bar" onOk={ noop } onErr={ s => console.log(s) } />;
    // NG
    <Extend foo="foo" />;   //// TS2322 | TS2326 | TS2769: 'bar' is missing
    // NG
    <Extend bar="bar" />;   //// TS2322 | TS2326 | TS2769: 'foo' is missing

    // Extend inherits prototype of Base.
    const ext = new Extend();
    console.log(ext.someProp, ext.someMethod());

    const WithNativeOn = vuetsx.withNativeOn(Base);
    <WithNativeOn foo="foo" nativeOnClick={ noop } />;
    console.log(new WithNativeOn().someProp);

    const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
    <WithHtmlAttrs foo="foo" accesskey="foo" />;
    console.log(new WithHtmlAttrs().someProp);

    const WithUnknownProps = vuetsx.withUnknownProps(Base);
    <WithUnknownProps foo="foo" unknown="foo" />;
    console.log(new WithUnknownProps().someProp);
}
