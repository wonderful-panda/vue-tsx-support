import Vue, { VNode } from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

@Component
class Test extends Vue {
  foo!: tsx.PropOf<string>;
  bar?: tsx.PropOf<number>;
  baz!: string;
  bra: any;
}

// OK
<Test foo="value" />;
// OK
<Test foo="value" bar={1} />;
// NG
<Test foo="value" bar={1} baz="value" />; //// TS2322 | TS2339: 'baz' does not exist
// NG
<Test />;   //// TS2322 | TS2326: 'foo' is missing

@Component
class Test2 extends Test {
  piyo!: tsx.PropOf<string[]>;
}

// OK
<Test2 foo="value" piyo={["foo"]} />;
// OK
<Test2 foo="value" bar={1} piyo={["foo"]} />;
// NG
<Test2 piyo={["foo"]} />; //// TS2322 | TS2326: 'foo' is missing

