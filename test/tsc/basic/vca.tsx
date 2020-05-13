import { component, SetupContext, emit, emitOn, updateEmitter } from "vue-tsx-support/lib/vca";
import { ref } from "@vue/composition-api";

const MyComponent = component({
  name: "MyComponentName",
  props: {
    foo: String,
    bar: { type: Boolean, required: true }
  },
  setup(props, ctx) {
    const el = ref<HTMLElement | null>(null);
    return () => (
      <div ref={el} class={props.foo}>
        {ctx.slots.default()}
      </div>
    );
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
    ctx: SetupContext<
      { onCutstomEvent: string | number },
      { ss: string | boolean },
      { customEvent: string | number }
    >
  ) {
    const emitUpdate = updateEmitter<typeof props>();
    const onClick = () => {
      emit(ctx, "customEvent", "value");
      emitOn(ctx, "onCutstomEvent", "value");
      emit(ctx, "customEvent", 1);
      emitOn(ctx, "onCutstomEvent", 1);

      emit(ctx, "customEvent2", "value"); //// TS2345
      emitOn(ctx, "onCutstomEvent2", "value"); //// TS2345

      emit(ctx, "customEvent", true); //// TS2345
      emitOn(ctx, "onCutstomEvent", true); //// TS2345

      emitUpdate(ctx, "foo", "value");
      emitUpdate(ctx, "fooo", "value"); //// TS2345
      emitUpdate(ctx, "foo", 0); //// TS2345
    };
    return () => (
      <div class={props.foo}>
        {ctx.slots.ss(true)}
        {ctx.slots.ss("value")}
      </div>
    );
  }
});

<MyComponent2 foo="a" onCutstomEvent={v => console.log(v.toUpperCase())} />; //// TS2339: 'string | number'
