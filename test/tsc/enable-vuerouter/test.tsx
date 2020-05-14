import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};
const func = (_: KeyboardEvent) => {};

/*
 * Components written by standard way
 */
function standardComponent() {
  const MyComponent = Vue.extend({});

  <router-link to="." />;
  <router-link to={{ name: "main" }} />;
  // NG
  <router-link to={{ name: 0 }} />; //// TS2322 | TS2326: 'number' is not assignable
}
