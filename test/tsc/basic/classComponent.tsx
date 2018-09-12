import { WithProps, ExVue, Keys, Component } from "vue-tsx-support/lib/class";

function withProps() {

  @Component
  class Test extends WithProps({ foo: String, bar: { type: String, required: true as true }}) {
    render() {
      console.log(this.foo);
      console.log(this.bar);
      console.log(this.baz);  //// TS2339: 'baz' does not exist
      return <div>{this.foo + this.bar}</div>;
    }
  }

  <Test foo="foo" bar="bar" />;
  <Test foo="foo" />;   //// TS2322: 'bar' is missing
  <Test bar="bar" baz="baz" />; //// TS2339: 'baz' does not exist
}

function propsDef() {
  @Component
  class Test extends ExVue {
    get [Keys.PropsDef]() {
      return {
        foo: String,
        bar: { type: String, required: true as true }
      };
    }
    render() {
      console.log(this.$props.foo);
      console.log(this.$props.bar);
      console.log(this.$props.baz);  //// TS2339: 'baz' does not exist
      return <div>{this.$props.foo + this.$props.bar}</div>;
    }
  }

  <Test foo="foo" bar="bar" />;
  <Test foo="foo" />;   //// TS2322: 'bar' is missing
  <Test bar="bar" baz="baz" />; //// TS2339: 'baz' does not exist
}

function events() {
  @Component
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
  @Component
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
