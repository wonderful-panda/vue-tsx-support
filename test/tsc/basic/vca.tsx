import { component } from "vue-tsx-support/lib/vca";

const MyComponent = component({
  props: {
    foo: String,
    bar: { type: Boolean, required: true }
  },
  setup(props, ctx) {
    return () => <div on={ctx.listeners}>{props.foo}</div>;
  }
});

<MyComponent foo="a" bar />;
<MyComponent foo="a" />; //// TS2322 | TS2769: 'bar' is missing
