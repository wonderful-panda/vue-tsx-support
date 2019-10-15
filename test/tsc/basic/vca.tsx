import { component, SetupContext, emit, emitOn } from "vue-tsx-support/lib/vca";

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

const MyComponent2 = component({
  props: {
    foo: String
  },
  setup(
    props,
    ctx: SetupContext<{ onCutstomEvent: string }, { ss: boolean }, { customEvent: string }>
  ) {
    const onClick = () => {
      emit(ctx, "customEvent", "value");
      emitOn(ctx, "onCutstomEvent", "value");

      emit(ctx, "customEvent2", "value"); //// TS2345
      emitOn(ctx, "onCutstomEvent2", "value"); //// TS2345

      emit(ctx, "customEvent", 1); //// TS2345
      emitOn(ctx, "onCutstomEvent", 1); //// TS2345
    };
    return () => <div class={props.foo}>{ctx.slots.ss(true)}</div>;
  }
});

<MyComponent2 foo="a" onCutstomEvent={v => console.log(v.toUpperCase())} />; // OK
