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
  <router-link
    to={{
      // @ts-expect-error: name must be string
      name: 0
    }}
  />;
}
