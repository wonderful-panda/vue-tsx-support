import Vue from "vue";
import * as vuetsx from "vue-tsx-support";

const noop = () => {};

interface Props {
  foo: string;
}

interface Events {
  onOk: void;
}

interface Props2 {
  bar: string;
}

interface Events2 {
  onErr: string;
}

const a = { foo: 1, bar: "" };

function by_createComponent() {
  const Base = vuetsx.createComponent<Props, Events>({});

  // NG
  // @ts-expect-error: 'foo' is missing
  <Base />;
  // OK
  <Base foo="foo" onOk={noop} />;
  // NG
  <Base
    foo="foo"
    // @ts-expect-error: 'bar' does not exist
    bar="bar"
  />;
  <Base
    foo="foo"
    // @ts-expect-error: 'onErr' does not exist
    onErr={noop}
  />;

  /* add more attributes */
  const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
  // OK
  <Extend foo="foo" bar="bar" onOk={noop} onErr={s => console.log(s)} />;
  // @ts-expect-error: 'bar' is missing
  <Extend foo="foo" />;
  // @ts-expect-error: 'foo' is missing
  <Extend bar="bar" />;

  const WithNativeOn = vuetsx.withNativeOn(Base);
  <WithNativeOn foo="foo" nativeOnClick={noop} />;

  const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
  <WithHtmlAttrs foo="foo" accesskey="foo" />;

  const WithUnknownProps = vuetsx.withUnknownProps(Base);
  <WithUnknownProps foo="foo" unknown="foo" />;
}

function by_convert() {
  const Base = vuetsx.ofType<Props, Events>().convert(Vue.extend({}));
  const BaseWithStatic: typeof Base & { staticMember: number } = Base as any;
  BaseWithStatic.staticMember = 1;

  /* add more attributes */
  const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(BaseWithStatic);
  // OK
  <Extend foo="foo" bar="bar" onOk={noop} onErr={s => console.log(s)} />;
  // OK
  console.log(Extend.staticMember);
  // @ts-expect-error: 'bar' is missing
  <Extend foo="foo" />; //// TS2322 | TS2326 | TS2769: 'bar' is missing
  // @ts-expect-error: 'foo' is missing
  <Extend bar="bar" />;

  const WithNativeOn = vuetsx.withNativeOn(Base);
  <WithNativeOn foo="foo" nativeOnClick={noop} />;

  const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
  <WithHtmlAttrs foo="foo" accesskey="foo" />;

  const WithUnknownProps = vuetsx.withUnknownProps(Base);
  <WithUnknownProps foo="foo" unknown="foo" />;
}

function by_class() {
  class Base extends vuetsx.Component<Props, Events> {
    someProp: string = "foo";
    someMethod() {}
  }

  /* add more attributes */
  const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
  // OK
  <Extend foo="foo" bar="bar" onOk={noop} onErr={s => console.log(s)} />;
  // NG
  // @ts-expect-error: 'bar' is missing
  <Extend foo="foo" />;
  // NG
  // @ts-expect-error: 'foo' is missing
  <Extend bar="bar" />;

  // Extend inherits prototype of Base.
  const ext = new Extend();
  console.log(ext.someProp, ext.someMethod());

  const WithNativeOn = vuetsx.withNativeOn(Base);
  <WithNativeOn foo="foo" nativeOnClick={noop} />;
  console.log(new WithNativeOn().someProp);

  const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
  <WithHtmlAttrs foo="foo" accesskey="foo" />;
  console.log(new WithHtmlAttrs().someProp);

  const WithUnknownProps = vuetsx.withUnknownProps(Base);
  <WithUnknownProps foo="foo" unknown="foo" />;
  console.log(new WithUnknownProps().someProp);
}

function by_componentFactory() {
  const Base = vuetsx.componentFactoryOf<Events>().create(
    {
      props: {
        foo: String
      },
      computed: {
        someProp(): string {
          return "";
        }
      },
      methods: {
        someMethod() {}
      }
    },
    ["foo"]
  );

  /* add more attributes */
  const Extend = vuetsx.ofType<Props2, Events2>().extendFrom(Base);
  // OK
  <Extend foo="foo" bar="bar" onOk={noop} onErr={s => console.log(s)} />;
  // NG
  // @ts-expect-error: 'bar' is missing
  <Extend foo="foo" />;
  // NG
  // @ts-expect-error: 'foo' is missing
  <Extend bar="bar" />;

  // Extend inherits prototype of Base.
  const ext = new Extend();
  console.log(ext.someProp, ext.someMethod());

  const WithNativeOn = vuetsx.withNativeOn(Base);
  <WithNativeOn foo="foo" nativeOnClick={noop} />;
  console.log(new WithNativeOn().someProp);

  const WithHtmlAttrs = vuetsx.withHtmlAttrs(Base);
  <WithHtmlAttrs foo="foo" accesskey="foo" />;
  console.log(new WithHtmlAttrs().someProp);

  const WithUnknownProps = vuetsx.withUnknownProps(Base);
  <WithUnknownProps foo="foo" unknown="foo" />;
  console.log(new WithUnknownProps().someProp);
}
