import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};
const func = (_: KeyboardEvent) => {}

/*
 * Components written by standard way
 */
function standardComponent() {
    const MyComponent = Vue.extend({});

    // NG
    <MyComponent a="value" />;      //// TS2322 | TS2339: 'a' does not exist
    // NG
    <MyComponent accesskey="akey" />;   //// TS2322 | TS2339: 'accesskey' does not exist
    // OK
    <MyComponent nativeOnClick={ noop } />;
    // NG
    <MyComponent nativeOnClick={ func } />; //// TS2322 | TS2326: /Types of .* are incompatible/
}
