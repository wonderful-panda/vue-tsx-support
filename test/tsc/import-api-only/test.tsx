import * as vuetsx from "vue-tsx-support/lib/api";
import Vue from "vue";

const noop = () => {};
const func = (_: KeyboardEvent) => {}

// when import api only, compiler checks nothing

/*
 * Intrinsic elements
 */
function intrinsicElements() {

    // OK
    <div />;
    // OK
    <div accesskey={ 0 } />;
}

/*
 * Components written by standard way
 */
function standardComponent() {
    const MyComponent = Vue.extend({});

    // OK
    <MyComponent a="value" />;
    // OK
    <MyComponent id={ 0 } />;
}

/*
 * Components written by createComponent
 */
function createComponent() {
    const MyComponent = vuetsx.createComponent<{ foo: string }>({});

    // OK
    <MyComponent />;
    // OK
    <MyComponent foo="foo-value" />;
    // OK
    <MyComponent foo={ 0 } />;
}
