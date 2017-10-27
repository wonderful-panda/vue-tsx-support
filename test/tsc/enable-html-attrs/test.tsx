import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Components written by standard way
 */
function standardComponent() {
    const MyComponent = Vue.extend({});

    // NG
    <MyComponent a="value" />;      //// TS2339: 'a' does not exist
    // OK
    <MyComponent accesskey="akey" />;
    // NG
    <MyComponent nativeOnClick={ noop } />;      //// TS2339: 'nativeOnClick' does not exist
}
