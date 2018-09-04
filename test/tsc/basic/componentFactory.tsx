import Vue, { VNode } from "vue";
import * as tsx from "vue-tsx-support";

function standardComponent() {
  const MyComponent = tsx.component(
    {
      props: {
        foo: String,
        bar: Number,
        baz: String
      },
      render(): VNode {
        return <span>{this.foo}</span>;
      }
    },
    ["foo", "bar"]
  );

  /* OK */
  <MyComponent foo="foo" bar={0} baz="baz" />;
  // baz is optional
  <MyComponent foo="foo" bar={0} />;
  // other known attributes
  <MyComponent foo="foo" bar={0} key="xxx" id="xxx" />;

  /* NG */
  <MyComponent />; //// TS2322: Property 'foo' is missing
  <MyComponent foo="foo" />; //// TS2322: Property 'bar' is missing
  <MyComponent foo={0} bar={1} />; //// TS2322: /'(0|number)' is not assignable/
  <MyComponent foo="foo" bar="bar" />; //// TS2322: /'("bar"|string)' is not assignable/
  <MyComponent foo="foo" bar={0} baz={1} />; //// TS2322: /'(1|number)' is not assignable/
  <MyComponent foo="foo" bar={0} unknown="unknown" />; //// TS2339: Property 'unknown' does not exist
}

function functionalComponent() {
  const MyComponent = tsx.component(
    {
      functional: true,
      props: {
        foo: String,
        bar: Number,
        baz: String
      },
      render(_h, ctx): VNode {
        return <span>{ctx.props.foo}</span>;
      }
    },
    ["foo", "bar"]
  );
  /* OK */
  <MyComponent foo="foo" bar={0} baz="baz" />;
  // baz is optional
  <MyComponent foo="foo" bar={0} />;
  // other known attributes
  <MyComponent foo="foo" bar={0} key="xxx" id="xxx" />;

  /* NG */
  <MyComponent />; //// TS2322: Property 'foo' is missing
  <MyComponent foo="foo" />; //// TS2322: Property 'bar' is missing
  <MyComponent foo={0} bar={1} />; //// TS2322: /'(0|number)' is not assignable/
  <MyComponent foo="foo" bar="bar" />; //// TS2322: /'("bar"|string)' is not assignable/
  <MyComponent foo="foo" bar={0} baz={1} />; //// TS2322: /'(1|number)' is not assignable/
  <MyComponent foo="foo" bar={0} unknown="unknown" />; //// TS2339: Property 'unknown' does not exist
}

function withoutRequiredPropNames() {
  const MyComponent = tsx.componentFactory.create({
    props: {
      foo: String,
      bar: Number,
      baz: String
    },
    render(): VNode {
      return <span>{this.foo}</span>;
    }
  });

  /* OK */
  <MyComponent foo="foo" bar={0} baz="baz" />;
  // foo, bar, baz are all optional
  <MyComponent />;
  // other known attributes
  <MyComponent key="xxx" id="xxx" />;

  /* NG */
  <MyComponent foo={0} />; //// TS2322: /'(0|number)' is not assignable/
  <MyComponent bar="bar" />; //// TS2322: /'("bar"|string)' is not assignable/
  <MyComponent baz={1} />; //// TS2322: /'(1|number)' is not assignable/
  <MyComponent unknown="unknown" />; //// TS2339: Property 'unknown' does not exist
}

function inferRequiredPropNames() {
  const MyComponent = tsx.componentFactory.create({
    props: {
      foo: { type: String, required: true as true },
      bar: { type: Number, required: false },
      baz: String
    },
    render(): VNode {
      return <span>{this.foo}</span>;
    }
  });

  /* OK */
  <MyComponent foo="foo" bar={0} baz="baz" />;
  // foo is required, bar and baz are optional
  <MyComponent foo="foo" />;
  <MyComponent />; //// TS2322: Property 'foo' is missing
  // other known attributes
  <MyComponent foo="foo" key="xxx" id="xxx" />;

  /* NG */
  <MyComponent foo={0} />; //// TS2322: /'(0|number)' is not assignable/
  <MyComponent foo="a" bar="bar" />; //// TS2322: /'("bar"|string)' is not assignable/
  <MyComponent foo="a" baz={1} />; //// TS2322: /'(1|number)' is not assignable/
  <MyComponent foo="a" unknown="unknown" />; //// TS2339: Property 'unknown' does not exist
}

function withWrongRequiredPropNames() {
  const MyComponent = tsx.componentFactory.create(
    {
      props: {
        foo: String,
        bar: Number,
        baz: String
      },
      render(): VNode {
        return <span>{this.foo}</span>;
      }
    },
    ["foo", "unknown"] //// TS2345: '"unknown"' is not assignable
  );
}

function componentFactoryOf() {
  const factory = tsx.componentFactoryOf<
    { onChange: number; onOk(target: any, id: string): void },
    { content: string }
  >();
  const MyComponent = factory.create({
    props: {
      foo: String,
      bar: Number
    },
    computed: {
      okNode(): VNode {
        return <div>{this.$scopedSlots.content("foo")}</div>;
      },
      ngNode(): VNode {
        return <div>{this.$scopedSlots.content(0)}</div>; //// TS2345: '0' is not assignable
      }
    },
    render(): VNode {
      return <div>{[this.okNode, this.ngNode]}</div>;
    }
  });

  /* checking type of scopedSlots */
  <MyComponent scopedSlots={{ content: p => p }} />;
  <MyComponent scopedSlots={{ content: p => p, unknown: (p: any) => p }} />;  //// TS2322: 'unknown' does not exist
  <MyComponent scopedSlots={{ content: (p: number) => p.toString() }} />; //// TS2322: 'string' is not assignable
  <MyComponent scopedSlots={{}} />; //// TS2322: Property 'content' is missing

  /* checking type of custom event handler */
  <MyComponent onChange={_v => {}} scopedSlots={{ content: p => p }} />;
  <MyComponent onChange={(_v: number) => {}} scopedSlots={{ content: p => p }} />;
  <MyComponent onChange={(_v: string) => {}} scopedSlots={{ content: p => p }} />; //// TS2322: 'number' is not assignable
  <MyComponent
    onOk={(_, id) => {
      console.log(id);
    }}
    scopedSlots={{ content: p => p }}
  />;
}

function extendFrom() {
  /*
     * extend from tsx component
     */
  const Base1 = tsx.component(
    {
      props: { foo: String },
      computed: {
        fooUpper(): string {
          return this.foo.toUpperCase();
        }
      }
    },
    ["foo"]
  );

  const Ext1 = tsx.extendFrom(Base1).create({
    props: { bar: String },
    render(): VNode {
      return <div>{this.fooUpper + this.bar}</div>;
    }
  });

  <Ext1 foo="a" bar="b" />;
  <Ext1 bar="b" />; //// TS2322: 'foo' is missing
  <Ext1 foo="a" bar="b" baz="c" />; //// TS2339: 'baz' does not exist

  /*
     * extend from class base tsx component
     */
  class Base2 extends tsx.Component<{ foo: string }, { onOk: string }> {
    get fooUpper() {
      return this.$props.foo.toUpperCase();
    }
  }

  const Ext2 = tsx.extendFrom(Base2).create({
    props: { bar: String },
    render(): VNode {
      return <div>{this.fooUpper + this.bar}</div>;
    }
  });

  <Ext2 foo="a" bar="b" />;
  <Ext2 bar="b" />; //// TS2322: 'foo' is missing
  <Ext2 foo="a" bar="b" baz="c" />; //// TS2339: 'baz' does not exist

  /*
     * extend from standard component
     */
  const Base3 = Vue.extend({
    data() {
      return { foo: "fooValue" };
    }
  });

  const Ext3 = tsx.extendFrom(Base3).create({
    props: {
      bar: String
    },
    render(): VNode {
      return <span>{this.foo + this.bar}</span>;
    }
  });

  <Ext3 />;
  <Ext3 bar="b" />;
  <Ext3 bar="b" baz="c" />; //// TS2339: 'baz' does not exist

  /*
     * extend from standard class base component
     */
  class Base4 extends Vue {
    get foo() {
      return "fooValue";
    }
  }

  const Ext4 = tsx.extendFrom(Base4).create({
    props: {
      bar: String
    },
    render(): VNode {
      return <span>{this.foo + this.bar}</span>;
    }
  });

  <Ext4 />;
  <Ext4 bar="b" />;
  <Ext4 bar="b" baz="c" />; //// TS2339: 'baz' does not exist
}
