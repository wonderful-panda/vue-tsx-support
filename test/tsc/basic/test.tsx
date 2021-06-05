import * as vuetsx from "vue-tsx-support";
import component from "vue-class-component";
import Vue from "vue";

const noop = () => {};

function assertType<T>(value: T) {
  return value;
}

/*
 * Intrinsic elements
 */
function intrinsicElements() {
  // OK
  <div id="foo" />;
  // OK
  <div ref="foo" key="foo" />;
  // OK
  <div {...{ attrs: { min: 0, max: 100 } }} />;
  // OK
  <input type="number" min={0} max={100} required />;
  // OK
  <a href="example.com" />;
  // OK
  <a onClick={noop} />;
  // OK
  <a on={{ click: noop }} />;
  // OK: kebab-case attribute have not to be defined
  <a domProp-innerHTML="foo" />;
  // OK: unknown element
  <foo bar="bar" />;

  // OK: specify style in 3 patterns
  <div style="display: flex;" />;
  <div style={{ display: "flex" }} />;
  <div style={[{ display: "flex" }]} />;

  // OK: inplace event handler: type of e.target is determined by containing tag.
  <input
    onInput={e => {
      assertType<InputEvent>(e);
      assertType<HTMLInputElement>(e.target);
    }}
  />;

  const onInput = (e: InputEvent) => {};
  <input onInput={onInput} />;

  // @ts-expect-error
  <div id={0} />;
  // @ts-expect-error
  <div href="example.com" />;
  // @ts-expect-error
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

  // OK
  <MyComponent />;
  // OK
  <MyComponent ref="refname" class="classname" key={1} />;
  // OK
  <MyComponent {...{ props: { a: "value" } }} />;
  // OK
  <MyComponent nativeOn-click={noop} />;
  // OK: unknown attributes are allowed in JSX spread.
  <MyComponent {...{ attrs: { min: 0, max: 100 } }} />;

  // @ts-expect-error
  <MyComponent a="value" />;

  // @ts-expect-error
  <MyComponent accesskey="akey" />;

  // NG: native event handler
  // @ts-expect-error
  <MyComponent nativeOnClick={noop} />;

  // OK: specify style in 3 patterns
  <MyComponent style="display: flex;" />;
  <MyComponent style={{ display: "flex" }} />;
  <MyComponent style={[{ display: "flex" }]} />;
}

interface Props {
  a: string;
  b?: number;
}

interface Events {
  onChange: string;
}

interface ScopedSlots {
  default: { ssprops: string };
}

/*
 * ofType and convert
 */
function convert() {
  const MyComponent1 = vuetsx.ofType<Props, Events>().convert(
    Vue.extend({
      methods: { greet() {} }
    })
  );
  const MyComponent2 = vuetsx.ofType<Props, Events, ScopedSlots>().convert(Vue.extend({}));
  const MyComponent3 = vuetsx.ofType<Props, Events>().convert({} as any);

  // NG: `a` is required
  // @ts-expect-error: 'a' is missing
  <MyComponent1 />;

  let vm!: InstanceType<typeof MyComponent1>;
  vm.greet(); // OK

  // OK
  <MyComponent1 a="foo" b={0} />;
  // OK
  <MyComponent1 a="foo" b={0} onChange={value => console.log(value.toUpperCase())} />;
  // NG: `c` is not defined
  <MyComponent1
    a="foo"
    // @ts-expect-error
    c="bar"
  />;
  // NG: `a` must be string
  <MyComponent1
    // @ts-expect-error
    a={0}
  />;
  // NG: `b` must be number
  <MyComponent1
    a="foo"
    // @ts-expect-error
    b="bar"
  />;

  // OK
  <MyComponent2 a="foo" scopedSlots={{ default: props => props.ssprops }} />;
  // NG
  <MyComponent2
    a="foo"
    // @ts-expect-error: 'default' is missing
    scopedSlots={{}}
  />;
  // NG
  <MyComponent2
    a="foo"
    scopedSlots={{
      default: props =>
        // @ts-expect-error: 'xxx' does not exist
        props.xxx
    }}
  />;

  // NG: `a` is required
  // @ts-expect-error
  <MyComponent3 />;

  // OK
  <MyComponent3 a="foo" b={0} />;
  // OK
  <MyComponent3 a="foo" b={0} onChange={value => console.log(value.toUpperCase())} />;
  // NG: `c` is not defined
  <MyComponent3
    a="foo"
    // @ts-expect-error
    c="bar"
  />;
  // NG: `a` must be string
  <MyComponent3
    // @ts-expect-error
    a={0}
  />;
  // NG: `b` must be number
  <MyComponent3
    a="foo"
    // @ts-expect-error
    b="bar"
  />;

  // NG: props object does not allow by default
  // @ts-expect-error
  <MyComponent1 {...{ props: { a: "foo", b: 0 } }} />;
}

/*
 * createComponent
 */
function createComponent() {
  const MyComponent = vuetsx.createComponent<Props>({});

  // NG: `a` is required
  // @ts-expect-error
  <MyComponent />;
  // OK
  <MyComponent a="foo" />;
  // OK
  <MyComponent a="foo" b={0} />;
  // NG: `c` is not defined
  <MyComponent
    a="foo"
    // @ts-expect-error
    c="bar"
  />;
  // NG: `a` must be string
  <MyComponent
    // @ts-expect-error
    a={0}
  />;
  // NG: `b` must be number
  <MyComponent
    a="foo"
    // @ts-expect-error
    b="bar"
  />;
}

/*
 * vue-class-component
 */
function vueClassComponent() {
  @component
  class MyComponent extends vuetsx.Component<Props, Events> {}

  @component
  class MyComponent2 extends vuetsx.Component<Props, Events, ScopedSlots> {
    render() {
      return <div>{this.$scopedSlots.default({ ssprops: "foo" })}</div>;
    }
  }

  @component
  class MyComponent3 extends vuetsx.Component<Props, Events, ScopedSlots> {
    render() {
      return (
        <div>
          {this.$scopedSlots.default({
            // @ts-expect-error: 'number' is not assignable
            ssprops: 1
          })}
        </div>
      );
    }
  }

  // NG: `a` is required
  // @ts-expect-error
  <MyComponent />;

  // OK
  <MyComponent a="foo" />;
  // OK
  <MyComponent a="foo" b={0} scopedSlots={{ default: (p: any) => p.xxx }} />;
  // OK
  <MyComponent a="foo" scopedSlots={{ default: (p: any) => [<span>{p.xxx}</span>] }} />;

  // NG: `c` is not defined
  <MyComponent
    a="foo"
    // @ts-expect-error
    c="bar"
  />;
  // NG: `a` must be string
  <MyComponent
    // @ts-expect-error
    a={0}
  />;
  // NG: `b` must be number
  <MyComponent
    a="foo"
    // @ts-expect-error
    b="bar"
  />;

  // OK
  <MyComponent2 a="foo" scopedSlots={{ default: p => p.ssprops }} />;
  // OK (unfortunately)
  <MyComponent2 a="foo" />;
  // NG
  <MyComponent2
    a="foo"
    scopedSlots={{
      default: p =>
        // @ts-expect-error: 'xxx' is not exist
        p.xxx
    }}
  />;
}

function knownAttrs() {
  const nope = () => {};
  const MyComponent = vuetsx.component({});

  <MyComponent hook={{ activated: nope }} />;
  <MyComponent attrs={{ type: "button" }} />;
  <MyComponent domProps={{ innerHTML: "xxx" }} />;
}

function functionalWrapper() {
  const MyComponent = vuetsx.component({});
  const Parent = vuetsx.component({
    functional: true,
    render(_h, { data, children }) {
      return <MyComponent {...{ data }}>{children}</MyComponent>;
    }
  });
}
