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
  <MyComponent a="value" />; //// TS2322 | TS2339 | TS2769: 'a' does not exist
  // NG
  <MyComponent accesskey="akey" />; //// TS2322 | TS2339 | TS2769: 'accesskey' does not exist
  // OK
  <MyComponent nativeOnClick={noop} />;
  // OK
  <MyComponent nativeOn={{ click: noop, "!keydown": func }} />;
  // NG
  <MyComponent nativeOnClick={func} />; //// TS2322 | TS2326 | TS2769
  // NG
  <MyComponent nativeOn={{ click: func }} />; //// TS2322 | TS2326 | TS2769
}
