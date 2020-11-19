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

  // @ts-expect-error
  <MyComponent />;
  // @ts-expect-error: 'bar' is missing
  <MyComponent foo="foo" />;
  <MyComponent
    // @ts-expect-error: 'number' is not assignable'
    foo={0}
    bar={1}
  />;
  <MyComponent
    foo="foo"
    // @ts-expect-error: 'string' is not assignable
    bar="bar"
  />;
  <MyComponent
    foo="foo"
    bar={0}
    // @ts-expect-error: 'number' is not assignable
    baz={1}
  />;
  <MyComponent
    foo="foo"
    bar={0}
    // @ts-expect-error: 'unknown' does not exist
    unknown="unknown"
  />;
}

function standardComponentWithDataAndWatch() {
  const MyComponent = tsx.component({
    props: {
      foo: String
    },
    data() {
      return { a: "a" };
    },
    watch: {
      a(value: string) {
        console.log(value);
      }
    },
    render(): VNode {
      return <span>{this.foo + this.a}</span>;
    }
  });
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
  // @ts-expect-error
  <MyComponent />;
  // @ts-expect-error: 'bar' is missing
  <MyComponent foo="foo" />;
  // @ts-expect-error: '(0|number)' is not assignable
  <MyComponent foo={0} bar={1} />;
  // @ts-expect-error: '("bar"|string)' is not assignable'
  <MyComponent foo="foo" bar="bar" />;
  // @ts-expect-error: '(1|number)' is not assignable
  <MyComponent foo="foo" bar={0} baz={1} />;
  // @ts-expect-error: 'unknown' does not exist
  <MyComponent foo="foo" bar={0} unknown="unknown" />;
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

  // @ts-expect-error: '(0|number)' is not assignable
  <MyComponent foo={0} />;
  // @ts-expect-error: '("bar"|string)' is not assignable
  <MyComponent bar="bar" />;
  // @ts-expect-error: '(1|number)' is not assignable
  <MyComponent baz={1} />;
  // @ts-expect-error: 'unknown' does not exist
  <MyComponent unknown="unknown" />;
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
  // other known attributes
  <MyComponent foo="foo" key="xxx" id="xxx" />;

  /* NG */
  // @ts-expect-error: 'foo' is missing
  <MyComponent />;
  <MyComponent
    // @ts-expect-error: 'number' is not assignable
    foo={0}
  />;
  <MyComponent
    foo="a"
    // @ts-expect-error: 'string' is not assignable
    bar="bar"
  />;
  <MyComponent
    foo="a"
    // @ts-expect-error: 'number' is not assignable
    baz={1}
  />;
  <MyComponent
    foo="a"
    // @ts-expect-error: 'unknown' does not exist
    unknown="unknown"
  />;
}

function withWrongRequiredPropNames() {
  // @ts-expect-error
  const MyComponent = tsx.component(
    {
      props: { foo: String }
    },
    ["foo", "unknown"]
  );
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
        return (
          <div>
            {
              // @ts-expect-error: ('0'|number) is not assignable
              this.$scopedSlots.content(0)
            }
          </div>
        );
      }
    },
    render(): VNode {
      return <div>{[this.okNode, this.ngNode]}</div>;
    }
  });

  /* checking type of scopedSlots */
  <MyComponent scopedSlots={{ content: p => p }} />;
  <MyComponent
    // @ts-expect-error: 'string' is not assiblable
    scopedSlots={{ content: (p: number) => p.toString() }}
  />;
  <MyComponent
    // @ts-expect-error: 'content' is missing
    scopedSlots={{}}
  />;

  /* checking type of custom event handler */
  <MyComponent onChange={_v => {}} />;
  <MyComponent onChange={(_v: string | number) => {}} />;
  <MyComponent
    // @ts-expect-error
    onChange={(_v: number) => {}}
  />;
  <MyComponent
    // @ts-expect-error
    onChange={(_v: string) => {}}
  />;
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
          {this.$scopedSlots.optional!(1)}
          {
            // @ts-expect-error: possibly 'undefined'
            this.$scopedSlots.optional(1)
          }
        </div>
      );
    }
  });

  /* checking type of scopedSlots */
  <MyComponent scopedSlots={{ required: p => p.toUpperCase() }} />;
  <MyComponent scopedSlots={{ required: p => p.toUpperCase(), optional: p => p.toString() }} />;
  <MyComponent
    // @ts-expect-error: 'required' is missing
    scopedSlots={{ optional: p => p.toString() }}
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
  // @ts-expect-error: 'foo' is missing
  <Ext1 bar="b" />;
  <Ext1
    foo="a"
    bar="b"
    // @ts-expect-error: 'baz' does not exist
    baz="c"
  />;

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
  // @ts-expect-error: 'foo' is missing
  <Ext2 bar="b" />;
  <Ext2
    foo="a"
    bar="b"
    // @ts-expect-error: 'baz' does not exisit
    baz="c"
  />;

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
  <Ext3
    bar="b"
    // @ts-expect-error: 'baz' does not exist
    baz="c"
  />;

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
  <Ext4
    bar="b"
    // @ts-expect-error: 'baz' does not exist
    baz="c"
  />;
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
  // @ts-expect-error: 'foo' is missing
  <Ext />;
}

function emitHelper() {
  const Component = tsx.componentFactoryOf<{ onOk: string | number }>().create({
    props: { foo: { type: String, required: true } },
    methods: {
      emitOk() {
        tsx.emitOn(this, "onOk", "foo");
        tsx.emitOn(this, "onOk", 1);
        // @ts-expect-error
        tsx.emitOn(this, "onOk", true);
        // @ts-expect-error
        tsx.emitOn(this, "onNg", { value: "foo" });
      },
      updateFoo() {
        tsx.emitUpdate(this, "foo", "value");
        // @ts-expect-error
        tsx.emitUpdate(this, "fooo", "value");
        // @ts-expect-error
        tsx.emitUpdate(this, "foo", 0);
      }
    }
  });
}
