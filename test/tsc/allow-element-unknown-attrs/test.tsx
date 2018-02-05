import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Intrinsic elements
 */
function intrinsicElements() {
    // OK
    <div id="foo" />;
    // OK: kebab-case attribute have not to be defined
    <a domProp-innerHTML="foo" />;
    // OK: unknown element
    <foo bar="bar" />;

    // OK: unknown attrs are allowed
    <a domPropInnerHTML="foo" />;
    // NG
    <div id={ 0 } />;   //// TS2322: /Type '(0|number)' is not assignable to/
    // OK: unknown attrs are allowed
    <div href="example.com" />;
    // OK: unknown attrs are allowed
    <a domPropInnerHTML="foo" />;
}

/*
 * Components written by standard way
 */
function standardComponent() {
    const MyComponent = Vue.extend({
        props: ["a"],
        template: "<span>{{ a }}</span>"
    });

    // Component unknown props are still rejected

    // NG: prop
    <MyComponent a="value" />;      //// TS2339: Property 'a' does not exist

    // NG: HTML element
    <MyComponent accesskey="akey" />;   //// TS2339: Property 'accesskey' does not exist

    // NG: native event handler
    <MyComponent nativeOnClick={ noop } />; //// TS2339: Property 'nativeOnClick' does not exist
}

