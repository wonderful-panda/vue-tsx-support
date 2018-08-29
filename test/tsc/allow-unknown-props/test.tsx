import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Intrinsic elements
 */
function intrinsicElements() {
  // unknown attributes of intrinsic element are rejected

  // NG
  <a domPropInnerHTML="foo" />; //// TS2339: Property 'domPropInnerHTML' does not exist
  // NG
  <div href="example.com" />; //// TS2339: Property 'href' does not exist
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
  <MyComponent a="value" />;
  // OK
  <MyComponent accesskey="akey" />;
  // OK
  <MyComponent nativeOnClick={noop} />;
}

/*
 * ofType and convert
 */
function convert() {
  const MyComponent = vuetsx.ofType<{ a: string }>().convert(Vue.extend({}));

  // OK
  <MyComponent a="value" />;
  // OK
  <MyComponent a="value" accesskey="akey" />;
  // OK
  <MyComponent a="value" nativeOnClick={noop} />;
  // NG
  <MyComponent />; //// TS2322: Property 'a' is missing
  // NG
  <MyComponent a={0} />; //// TS2322: /'(0|number)' is not assignable/
}
