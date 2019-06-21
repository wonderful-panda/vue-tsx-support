import Vue from "vue";
import Component from "vue-class-component";
import { DefineTsxProps } from "vue-tsx-support";

@Component
class Test extends Vue {
  foo!: string;
  bar?: number;
  baz!: string;
  bra!: number;

  static TsxProps: DefineTsxProps<Test, "foo" | "bar" | "baz", "baz">;
}

class Test2 extends Test {
  piyo!: string[];
  static TsxProps: DefineTsxProps<Test2, "piyo"> & typeof Test.TsxProps;
}

// OK
<Test foo="value" />;
// OK
<Test foo="value" bar={1} />;
// OK
<Test foo="value" bar={1} baz="value" />;
// NG
<Test foo="value" bar={1} bra={1} />; //// TS2322 | TS2339: 'baz' does not exist
// NG
<Test />;   //// TS2322 | TS2326: 'foo' is missing

// OK
<Test2 foo="value" piyo={["foo"]} />;
// OK
<Test2 foo="value" bar={1} piyo={["foo"]} />;
// NG
<Test2 piyo={["foo"]} />; //// TS2322 | TS2326: 'foo' is missing

