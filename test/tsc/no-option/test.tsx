import * as vuetsx from "vue-tsx-support";
import component from "vue-class-component";
import Vue from "vue";

const noop = () => {};

/*
 * Intrinsic elements
 */
function intrinsicElements() {
    // OK
    <div id="foo" />;
    // OK
    <div ref="foo" key="foo" />;
    // OK
    <div { ...{ attrs: { min: 0, max: 100 } } } />;
    // OK
    <input type="number" min={ 0 } max={ 100 } required />;
    // OK
    <a href="example.com" />;
    // OK
    <a onClick={ noop } />;
    // OK: kebab-case attribute have not to be defined
    <a domProp-innerHTML="foo" />;
    // OK: unknown element
    <foo bar="bar" />;

    // NG
    <div id={ 0 } />;   //// TS2322: Type '0' is not assignable to
    // NG
    <div href="example.com" />; //// TS2339: Property 'href' does not exist
    // NG
    <a domPropInnerHTML="foo" />;   //// TS2339: Property 'domPropInnerHTML' does not exist
}


/*
 * Components written by standard way
 */
function standardComponent() {
    const MyComponent = Vue.extend({
        props: ["a"],
        template: "<span>{{ a }}</span>"
    });

    // OK
    <MyComponent />;
    // OK
    <MyComponent ref="refname" class="classname" key={ 1 } />;
    // OK
    <MyComponent { ...{ props: { a: "value" } } } />;
    // OK
    <MyComponent nativeOn-click={ noop } />;
    // OK: unknown attributes are allowed in JSX spread.
    <MyComponent { ...{ attrs: { min: 0, max: 100 } } } />;

    // NG: prop
    <MyComponent a="value" />;      //// TS2339: Property 'a' does not exist

    // NG: HTML element
    <MyComponent accesskey="akey" />;   //// TS2339: Property 'accesskey' does not exist

    // NG: native event handler
    <MyComponent nativeOnClick={ noop } />; //// TS2339: Property 'nativeOnClick' does not exist
}

interface Props {
    a: string;
    b?: number;
}

interface Events {
    onChange: string;
}

interface ScopedSlots {
    default: { ssprops: string }
}

/*
 * ofType and convert
 */
function convert() {
    const MyComponent1 = vuetsx.ofType<Props, Events>().convert(Vue.extend({}));
    const MyComponent2 = vuetsx.ofType<Props, Events, ScopedSlots>().convert(Vue.extend({}));

    // NG: `a` is required
    <MyComponent1 />;    //// TS2322: 'a' is missing

    // OK
    <MyComponent1 a="foo" b={ 0 } />;
    // OK
    <MyComponent1 a="foo" b={ 0 } onChange={ value => console.log(value.toUpperCase()) } />;
    // NG: `c` is not defined
    <MyComponent1 a="foo" c="bar" />;  //// TS2339: 'c' does not exist
    // NG: `a` must be string
    <MyComponent1 a={ 0 } />;          //// TS2322: '0' is not assignable
    // NG: `b` must be number
    <MyComponent1 a="foo" b="bar" />;  //// TS2322: '"bar"' is not assignable

    // OK
    <MyComponent2 a="foo" scopedSlots={{ default: props => props.ssprops }} />;
    // NG
    <MyComponent2 a="foo" scopedSlots={{}} />;   //// TS2322: 'default' is missing
    // NG
    <MyComponent2 a="foo" scopedSlots={{ default: props => props.xxx }} />;   //// TS2339: 'xxx' does not exist
}

/*
 * createComponent
 */
function createComponent() {
    const MyComponent = vuetsx.createComponent<Props>({});

    // NG: `a` is required
    <MyComponent />;    //// TS2322: 'a' is missing

    // OK
    <MyComponent a="foo" />;
    // OK
    <MyComponent a="foo" b={ 0 } />;
    // NG: `c` is not defined
    <MyComponent a="foo" c="bar" />;  //// TS2339: 'c' does not exist
    // NG: `a` must be string
    <MyComponent a={ 0 } />;          //// TS2322: '0' is not assignable
    // NG: `b` must be number
    <MyComponent a="foo" b="bar" />;  //// TS2322: '"bar"' is not assignable

}

/*
 * vue-class-component
 */
function vueClassComponent() {
    @component
    class MyComponent extends vuetsx.Component<Props, Events> {
    }

    @component
    class MyComponent2 extends vuetsx.Component<Props, Events, ScopedSlots> {
        render() {
            return <div>{ this.$scopedSlots.default({ ssprops: "foo" }) }</div>;
        }
    }

    @component
    class MyComponent3 extends vuetsx.Component<Props, Events, ScopedSlots> {
        render() {
            return <div>{ this.$scopedSlots.default({ ssprops: 1 }) }</div>;    //// TS2345: 'number' is not assignable
        }
    }


    // NG: `a` is required
    <MyComponent />;    //// TS2322: 'a' is missing

    // OK
    <MyComponent a="foo" />;
    // OK
    <MyComponent a="foo" b={ 0 } scopedSlots={{ default: p => p.ssprops }} />;
    // OK
    <MyComponent a="foo" scopedSlots={{ default: p => [<span>{ p.ssprops }</span>] }} />;

    // NG: `c` is not defined
    <MyComponent a="foo" c="bar" />;  //// TS2339: 'c' does not exist
    // NG: `a` must be string
    <MyComponent a={ 0 } />;          //// TS2322: '0' is not assignable
    // NG: `b` must be number
    <MyComponent a="foo" b="bar" />;  //// TS2322: '"bar"' is not assignable

    // OK
    <MyComponent2 a="foo" scopedSlots={{ default: p => p.ssprops }} />;
    // OK (unfortunately)
    <MyComponent2 a="foo" />;
    // NG
    <MyComponent2 a="foo" scopedSlots={{ default: p => p.xxx }} />;   //// TS2339: 'xxx' does not exist
}

