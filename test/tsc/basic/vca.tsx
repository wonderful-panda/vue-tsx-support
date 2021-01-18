import { component, SetupContext, emit, emitOn, updateEmitter } from "vue-tsx-support/lib/vca";
import { ref } from "@vue/composition-api";
import { VNode } from "vue";

const nope = () => undefined;

const MyComponent = component({
  name: "MyComponentName",
  props: {
    foo: String,
    bar: { type: Boolean, required: true }
  },
  setup(props, ctx) {
    const el = ref<HTMLElement | null>(null);

    const emitUpdate = updateEmitter<typeof props>();
    emitUpdate(ctx, "foo", "value");
    // @ts-expect-error
    emitUpdate(ctx, "fooo", "value"); //// TS2345
    // @ts-expect-error
    emitUpdate(ctx, "foo", 0); //// TS2345

    return () => (
      <div ref={el} class={props.foo}>
        {(ctx.slots.default || nope)()}
      </div>
    );
  }
});

<MyComponent foo="a" bar />; // OK
<MyComponent bar />; // OK
// @ts-expect-error
<MyComponent foo="a" />;

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
    emit(ctx, "customEvent", "value");
    emitOn(ctx, "onCutstomEvent", "value");
    emit(ctx, "customEvent", 1);
    emitOn(ctx, "onCutstomEvent", 1);

    // @ts-expect-error
    emit(ctx, "customEvent2", "value"); //// TS2345
    // @ts-expect-error
    emitOn(ctx, "onCutstomEvent2", "value"); //// TS2345

    // @ts-expect-error
    emit(ctx, "customEvent", true); //// TS2345
    // @ts-expect-error
    emitOn(ctx, "onCutstomEvent", true); //// TS2345

    emitUpdate(ctx, "foo", "value");
    // @ts-expect-error
    emitUpdate(ctx, "fooo", "value"); //// TS2345
    // @ts-expect-error
    emitUpdate(ctx, "foo", 0); //// TS2345

    return () => (
      <div class={props.foo}>
        {ctx.slots.ss(true)}
        {ctx.slots.ss("value")}
      </div>
    );
  }
});

const MyComponent3 = component({
  props: {
    foo: String
  },
  setup(props, ctx: SetupContext<{ onCutstomEvent: string | number }, { ss: string | boolean }>) {
    const emitUpdate = updateEmitter<typeof props>();

    emitOn(ctx, "onCutstomEvent", "value");
    emitOn(ctx, "onCutstomEvent", 1);
    // @ts-expect-error
    emitOn(ctx, "onCutstomEvent2", "value"); //// TS2345
    // @ts-expect-error
    emitOn(ctx, "onCutstomEvent", true); //// TS2345

    emitUpdate(ctx, "foo", "value");
    // @ts-expect-error
    emitUpdate(ctx, "fooo", "value"); //// TS2345
    // @ts-expect-error
    emitUpdate(ctx, "foo", 0); //// TS2345

    return () => <div class={props.foo} />;
  }
});

<MyComponent2
  foo="a"
  onCutstomEvent={v =>
    console.log(
      // @ts-expect-error: 'toUpperCase' does not exist on type 'string | number'
      v.toUpperCase()
    )
  }
/>;

const MyComponentWithRender = component({
  name: "MyComponentName",
  props: {
    foo: String,
    bar: { type: Boolean, required: true }
  },
  setup(props, ctx) {
    const el = ref<HTMLElement | null>(null);
    const greet = () => console.log("hello");
    const render_ = () => (
      <div ref={el} class={props.foo}>
        {(ctx.slots.default || nope)()}
      </div>
    );
    return {
      greet,
      render_
    };
  },
  render(): VNode {
    return this.render_();
  }
});

const vm = {} as InstanceType<typeof MyComponentWithRender>;
vm.greet();
