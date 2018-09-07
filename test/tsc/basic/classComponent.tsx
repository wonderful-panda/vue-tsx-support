import { WithProps, ExVue, Keys } from "vue-tsx-support/lib/class";

function propsDef() {

  class Test extends WithProps({ foo: String, bar: { type: String, required: true as true }}) {
    render() {
      return <div>{this.foo + this.bar}</div>;
    }
  }

  <Test foo="foo" bar="bar" />;
  <Test foo="foo" />;   //// TS2322: 'bar' is missing
  <Test bar="bar" baz="baz" />; //// TS2339: 'baz' does not exist
}

function events() {

  class Test extends ExVue {
    get [Keys.Events]() {
      return {
        onClick(_arg: { button: number }) {}
      }
    }
    render() {
      return <div onClick={e => this.$$emit.onClick({ button: e.button })}>Test</div>;
    }
  }

  <Test onClick={arg => console.log(arg.button)} />;
  <Test onClick={arg => console.log(arg.unknown)} />;   //// TS2339: 'unknown' does not exist
}

function scopedSlots() {
  class Test extends ExVue {
    get [Keys.ScopedSlots]() {
      return {
        default(_: { msg: string }) {}
      }
    }
    render() {
      return <div>{ this.$scopedSlots.default({ msg: "hello" })}</div>;
    }
  }

  <Test scopedSlots={{
    default: arg => [<span>{arg.msg}</span>]
  }} />;

  <Test scopedSlots={{ unknown: (arg: any) => [<span>{arg}</span>] }} />;   //// TS2322: 'unknown' does not exist
}
