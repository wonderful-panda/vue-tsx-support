import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import { DefineProps, InnerScopedSlots } from "vue-tsx-support";

function TsxEvent(target: Vue, name: string, descriptor: any): void {
  const eventName = name.replace(/^on(.)/, (_, head: string) => head.toLowerCase());
  Emit(eventName)(target, name, descriptor);
}

@Component
class Test extends Vue {
  static TsxProps: DefineProps<Test, "foo" | "bar", "baz" | "onCustomEvent">;

  @Prop(String) foo!: string;
  @Prop(Number) bar?: number;
  @Prop({ type: String, default: "defaultValue" }) baz!: string;

  bra!: number;

  /** @TsxEvent onCustomEvent() {} は @Emit("customEvent") onCustomEvent() のショートハンド */
  @TsxEvent onCustomEvent() {}

  $scopedSlots!: InnerScopedSlots<{
    default: { ssprops: string },
    optional?: string
  }>;
}

class Test2 extends Test {
  piyo!: string[];
  static TsxProps: DefineProps<Test2, "piyo"> & typeof Test.TsxProps;
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
