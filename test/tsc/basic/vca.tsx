import { component, componentFactoryOf } from "vue-tsx-support/lib/vca";

const MyComponent = component({
  props: {
    foo: String,
    bar: { type: Boolean, required: true }
  },
  setup(props, ctx) {
    return () => <div class={props.foo}>{ctx.slots.default()}</div>;
  }
});

<MyComponent foo="a" bar />; // OK
<MyComponent bar />; // OK
<MyComponent foo="a" />; //// TS2322 | TS2769: 'bar' is missing

const MyComponent2 = componentFactoryOf<{ onCustomEvent: string }, { ss: boolean }>().create({
  props: {
    foo: String
  },
  setup(props, ctx) {
    return () => <div class={props.foo}>{ctx.slots.ss(true)}</div>;
  }
});

<MyComponent2 foo="a" onCustomEvent={s => console.log(s.toUpperCase())} />; // OK
