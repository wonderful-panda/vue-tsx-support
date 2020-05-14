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
    /* requiredPropNames */ ["foo", "bar"]
  );

  /* OK */
  <MyComponent foo="foo" bar={0} baz="baz" />;
  // baz is optional
  <MyComponent foo="foo" bar={0} />;
  // other known attributes
  <MyComponent foo="foo" bar={0} key="xxx" id="xxx" />;

  /* NG */
  <MyComponent />; //// TS2322 | TS2326 | TS2769
  <MyComponent foo="foo" />; //// TS2322 | TS2326 | TS2769: Property 'bar' is missing
  <MyComponent foo={0} bar={1} />; //// TS2322 | TS2326 | TS2769: /'(0|number)' is not assignable/
  <MyComponent foo="foo" bar="bar" />; //// TS2322 | TS2326 | TS2769: /'("bar"|string)' is not assignable/
  <MyComponent foo="foo" bar={0} baz={1} />; //// TS2322 | TS2326 | TS2769: /'(1|number)' is not assignable/
  <MyComponent foo="foo" bar={0} unknown="unknown" />; //// TS2322 | TS2339 | TS2769: Property 'unknown' does not exist
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
  <MyComponent />; //// TS2322 | TS2326 | TS2769
  <MyComponent foo="foo" />; //// TS2322 | TS2326 | TS2769: Property 'bar' is missing
  <MyComponent foo={0} bar={1} />; //// TS2322 | TS2326 | TS2769: /'(0|number)' is not assignable/
  <MyComponent foo="foo" bar="bar" />; //// TS2322 | TS2326 | TS2769: /'("bar"|string)' is not assignable/
  <MyComponent foo="foo" bar={0} baz={1} />; //// TS2322 | TS2326 | TS2769: /'(1|number)' is not assignable/
  <MyComponent foo="foo" bar={0} unknown="unknown" />; //// TS2322 | TS2339 | TS2769: Property 'unknown' does not exist
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
  <MyComponent foo={0} />; //// TS2322 | TS2326 | TS2769: /'(0|number)' is not assignable/
  <MyComponent bar="bar" />; //// TS2322 | TS2326 | TS2769: /'("bar"|string)' is not assignable/
  <MyComponent baz={1} />; //// TS2322 | TS2326 | TS2769: /'(1|number)' is not assignable/
  <MyComponent unknown="unknown" />; //// TS2322 | TS2339 | TS2769: Property 'unknown' does not exist
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
  <MyComponent />; //// TS2322 | TS2326 | TS2769: Property 'foo' is missing
  // other known attributes
  <MyComponent foo="foo" key="xxx" id="xxx" />;

  /* NG */
  <MyComponent foo={0} />; //// TS2322 | TS2326 | TS2769: /'(0|number)' is not assignable/
  <MyComponent foo="a" bar="bar" />; //// TS2322 | TS2326 | TS2769: /'("bar"|string)' is not assignable/
  <MyComponent foo="a" baz={1} />; //// TS2322 | TS2326 | TS2769: /'(1|number)' is not assignable/
  <MyComponent foo="a" unknown="unknown" />; //// TS2322 | TS2339 | TS2769: Property 'unknown' does not exist
}

function withWrongRequiredPropNames() {
  const MyComponent = tsx.component({ props: { foo: String } }, ["foo", "unknown"]); //// TS2345 | TS2769
}

function componentFactoryOf() {
  const factory = tsx.componentFactoryOf<
    { onChange: number | string; onOk(target: any, id: string): void },
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
  <MyComponent scopedSlots={{ content: (p: number) => p.toString() }} />; //// TS2322 | TS2326 | TS2769: 'string' is not assignable
  <MyComponent scopedSlots={{}} />; //// TS2322 | TS2326 | TS2741 | TS2769: Property 'content' is missing

  /* checking type of custom event handler */
  <MyComponent onChange={_v => {}} />;
  <MyComponent onChange={(_v: string | number) => {}} />;
  <MyComponent onChange={(_v: number) => {}} />; //// TS2322 | TS2326 | TS2769: '(_v: number) => void' is not assignable
  <MyComponent onChange={(_v: string) => {}} />; //// TS2322 | TS2326 | TS2769: '(_v: string) => void' is not assignable
  <MyComponent
    onOk={(_, id) => {
      console.log(id);
    }}
  />;
}

function optionalScopedSlot() {
  const factory = tsx.componentFactoryOf<{}, { required: string; optional?: number }>();
  const MyComponent = factory.create({
    props: {
      foo: String,
      bar: Number
    },
    render(): VNode {
      return (
        <div>
          {this.$scopedSlots.optional!(1)} // OK
          {this.$scopedSlots.optional(1)} //// TS2722: possibly 'undefined'
        </div>
      );
    }
  });

  /* checking type of scopedSlots */
  <MyComponent scopedSlots={{ required: p => p.toUpperCase() }} />;
  <MyComponent scopedSlots={{ required: p => p.toUpperCase(), optional: p => p.toString() }} />;
  <MyComponent scopedSlots={{ optional: p => p.toString() }} />; //// TS2322 | TS2741 | TS2769: 'required' is missing
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
  <Ext1 bar="b" />; //// TS2322 | TS2326 | TS2769: 'foo' is missing
  <Ext1 foo="a" bar="b" baz="c" />; //// TS2322 | TS2339 | TS2769: 'baz' does not exist

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
  <Ext2 bar="b" />; //// TS2322 | TS2326 | TS2769: 'foo' is missing
  <Ext2 foo="a" bar="b" baz="c" />; //// TS2322 | TS2339 | TS2769: 'baz' does not exist

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
  <Ext3 bar="b" baz="c" />; //// TS2322 | TS2339 | TS2769: 'baz' does not exist

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
  <Ext4 bar="b" baz="c" />; //// TS2322 | TS2339 | TS2769: 'baz' does not exist
}

function withXXX() {
  const Base = tsx
    .componentFactoryOf<{ onOk: { value: string } }, { default: { value: string } }>()
    .create({
      props: { foo: { type: String, required: true as true } }
    });
  const Ext = tsx.withNativeOn(Base);
  <Ext foo="a" />;
  <Ext foo="a" onOk={v => console.log(v.value)} />;
  <Ext foo="a" scopedSlots={{ default: v => v.value }} />;
  <Ext foo="a" nativeOnClick={() => {}} />;
  <Ext />; //// TS2322 | TS2326 | TS2769: 'foo' is missing
}

function emitHelper() {
  const Component = tsx.componentFactoryOf<{ onOk: string | number }>().create({
    props: { foo: { type: String, required: true } },
    methods: {
      emitOk() {
        tsx.emitOn(this, "onOk", "foo");
        tsx.emitOn(this, "onOk", 1);
        tsx.emitOn(this, "onOk", true); //// TS2345: not assignable
        tsx.emitOn(this, "onNg", { value: "foo" }); //// TS2345: not assignable
      },
      updateFoo() {
        tsx.emitUpdate(this, "foo", "value");
        tsx.emitUpdate(this, "fooo", "value"); //// TS2345: not assignable
        tsx.emitUpdate(this, "foo", 0); //// TS2345: not assignable
      }
    }
  });
}
