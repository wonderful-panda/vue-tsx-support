import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};
const func = (_: KeyboardEvent) => {};

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
  // NG
  <MyComponent
    // @ts-expect-error
    accesskey="akey"
  />;
  // OK
  <MyComponent nativeOnClick={noop} />;
  // OK
  <MyComponent nativeOn={{ click: noop, "!keydown": func }} />;
  // NG
  <MyComponent
    // @ts-expect-error
    nativeOnClick={func}
  />;
  // NG
  <MyComponent
    nativeOn={{
      // @ts-expect-error
      click: func
    }}
  />;
}
