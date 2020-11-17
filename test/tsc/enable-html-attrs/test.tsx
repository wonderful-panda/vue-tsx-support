import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Components written by standard way
 */
function standardComponent() {
  const MyComponent = Vue.extend({});

  // NG
  <MyComponent
    // @ts-expect-error
    a="value"
  />;
  // OK
  <MyComponent accesskey="akey" />;
  // NG
  <MyComponent
    // @ts-expect-error
    nativeOnClick={noop}
  />;
}
