import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

const noop = () => {};

/*
 * Intrinsic elements
 */
function intrinsicElements() {
  // OK
  <div id="foo" />;
  // OK: kebab-case attribute have not to be defined
  <a domProp-innerHTML="foo" />;
  // OK: unknown element
  <foo bar="bar" />;

  // OK: unknown attrs are allowed
  <a domPropInnerHTML="foo" />;
  // @ts-expect-error
  <div id={0} />; //// TS2322 | TS2326: /Type '(0|number)' is not assignable to/
  // OK: unknown attrs are allowed
  <div href="example.com" />;
  // OK: unknown attrs are allowed
  <a domPropInnerHTML="foo" />;
}

/*
 * Components written by standard way
 */
function standardComponent() {
  const MyComponent = Vue.extend({
    props: ["a"],
    template: "<span>{{ a }}</span>"
  });

  // Component unknown props are still rejected

  // NG: prop
  // @ts-expect-error: a does not exist
  <MyComponent a="value" />;

  // NG: HTML element
  // @ts-expect-error: accesskey does not exist
  <MyComponent accesskey="akey" />; //// TS2322 | TS2339 | TS2769: Property 'accesskey' does not exist

  // NG: native event handler
  // @ts-expect-error: nativeOnClick does not exist
  <MyComponent nativeOnClick={noop} />;
}
