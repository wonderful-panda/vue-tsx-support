import Vue, { VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import { DefineAttrs, InnerScopedSlots } from "vue-tsx-support";
import { EmitWithoutPrefix as Emit } from "vue-tsx-support/lib/decorator";
import { DefineExtendedComponentAttrs, ExposeAllPublicMembers, DefineEvents } from "vue-tsx-support";

@Component
class Test extends Vue {
  $tsx!: DefineAttrs<Test, "foo" | "bar", "baz" | "onCustomEvent"> & DefineEvents<{ foo: string, bar: [string, number]}>;

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
  $tsx!: DefineExtendedComponentAttrs<Test2, Test, "piyo"> & DefineEvents<{ baz: [] }>;
  $scopedSlots!:
    Test["$scopedSlots"] & InnerScopedSlots<{ additional: { foo: string, bar: number }}>;
}

// OK
<Test foo="value" />;
// OK
<Test foo="value" bar={1} />;
// OK
<Test foo="value" bar={1} baz="value" />;
// OK
<Test foo="value" on={{}} />;
// OK
<Test foo="value" on={{
  foo: p => console.log(p.toLocaleLowerCase()),
  bar: (p1, p2) => console.log(p1.toLocaleLowerCase(), p2.toFixed())
}} />;
// NG
<Test foo="value" bar={1} bra={1} />; //// TS2322 | TS2339: 'bra' does not exist
// NG
<Test />;   //// TS2322 | TS2326: 'foo' is missing

// NG
<Test foo="value" on={{
  fooo: (p: any) => console.log(p)   //// TS2322: 'fooo' does not exist
}} />;

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
// OK
<Test2 foo="value" piyo={[]} on={{
  foo: p => console.log(p.toLocaleLowerCase()),
  baz: () => console.log("baz")
}} />;

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
  $tsx!: DefineAttrs<GenericTest<T>, "foo" | "bar">;

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

@Component
class Test3 extends Vue {
  $tsx!: ExposeAllPublicMembers<Test3, Vue, "bra" | "test">;

  @Prop(String) foo!: string;
  @Prop(Number) bar?: number;

  bra!: number;

  test() {}
}

// OK
<Test3 foo="fooValue" />;
// OK
<Test3 foo="fooValue" bar={1} />;
// NG
<Test3 bar={1} />;    //// TS2322: 'foo' is missing
// OK
<Test3 foo="fooValue" bra={1} />;   //// TS2322: 'bra' does not exist
