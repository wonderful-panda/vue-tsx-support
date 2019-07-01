import Vue, { VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import { DefineAttrs, InnerScopedSlots, tsxkey } from "vue-tsx-support";
import { EmitWithoutPrefix as Emit } from "vue-tsx-support/lib/decorator";
import { DefineExtendedComponentAttrs } from "vue-tsx-support/types/base";

@Component
class Test extends Vue {
  [tsxkey]!: DefineAttrs<Test, "foo" | "bar", "baz" | "onCustomEvent">;

  @Prop(String) foo!: string;
  @Prop(Number) bar?: number;
  @Prop({ type: String, default: "defaultValue" }) baz!: string;

  bra!: number;

  @Emit onCustomEvent() {}

  $scopedSlots!: InnerScopedSlots<{
    default: { ssprops: string },
    optional?: string
  }>;
}

class Test2 extends Test {
  piyo!: string[];
  [tsxkey]!: DefineExtendedComponentAttrs<Test2, Test, "piyo">;
  $scopedSlots!:
    Test["$scopedSlots"] & InnerScopedSlots<{ additional: { foo: string, bar: number }}>;
}

// OK
<Test foo="value" />;
// OK
<Test foo="value" bar={1} />;
// OK
<Test foo="value" bar={1} baz="value" />;
// NG
<Test foo="value" bar={1} bra={1} />; //// TS2322 | TS2339: 'bra' does not exist
// NG
<Test />;   //// TS2322 | TS2326: 'foo' is missing

<Test foo="value" scopedSlots={{
  default: props => props.ssprops
}} />;

<Test foo="value" scopedSlots={{
  default: props => props.ssprops,
  optional: props => props.toUpperCase()
}} />;

<Test foo="value" scopedSlots={{          //// TS2322 | TS2326: 'default' is missing
  optional: props => props.toUpperCase()
}} />;

// OK
<Test2 foo="value" piyo={["foo"]} />;
// OK
<Test2 foo="value" bar={1} piyo={["foo"]} />;
// NG
<Test2 piyo={["foo"]} />; //// TS2322 | TS2326: 'foo' is missing
// OK
<Test2 foo="value" bar={1} piyo={["foo"]}
  scopedSlots={{
    default: props => props.ssprops,
    additional: props => `${props.foo} ${props.bar}`
  }}
/>;

@Component
class GenericTest<T> extends Vue {
  [tsxkey]!: DefineAttrs<GenericTest<T>, "foo" | "bar">;

  @Prop() foo!: T;
  @Prop(Function) bar!: (value: T) => string;

  $scopedSlots!: InnerScopedSlots<{
    default: { item: T },
    optional?: string
  }>;
}

@Component
class GenericParent<T> extends Vue {
  value!: T;
  bar(value: T): string {
    return "";
  }
  render(): VNode {
    const GenericTestT = GenericTest as new () => GenericTest<T>;
    return <GenericTestT foo={this.value} bar={this.bar} scopedSlots={{
      default: props => <div>{this.bar(props.item)}</div>
    }} />;
  }
}
