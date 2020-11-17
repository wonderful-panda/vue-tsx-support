import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Intrinsic elements
 */
function intrinsicElements() {
  // unknown attributes of intrinsic element are rejected

  // @ts-expect-error: domPropInnerHTML does not exist
  <a domPropInnerHTML="foo" />;
  // @ts-expect-error: href does not exist
  <div href="example.com" />;
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
  // @ts-expect-error: property 'a' is missing
  <MyComponent />;
  // NG
  // @ts-expect-error: property 'a' must be string
  <MyComponent a={0} />;
}
