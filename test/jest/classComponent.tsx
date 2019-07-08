import { mount } from "@vue/test-utils";
import Vue, { VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import { DefineProps, InnerScopedSlots } from "vue-tsx-support";
import { EmitWithoutPrefix as Emit } from "vue-tsx-support/lib/decorator";

describe("classComponent", () => {
  @Component
  class Test extends Vue {
    @Emit
    onCustomEvent(_: string) {}

    @Prop({ type: String, required: true })
    foo!: string;
    @Prop({ type: String })
    bar?: string;

    emitCustomEvent(arg: string) {
      this.onCustomEvent(arg);
    }

    private render(): VNode {
      const defaultSlot = this.$scopedSlots.default;
      const content = defaultSlot ? defaultSlot(this.foo) : this.foo;
      return <div>{content}</div>;
    }
    _tsx!: DefineProps<Test, "foo" | "bar", "onCustomEvent">;
    $scopedSlots!: InnerScopedSlots<{ default?: string }>;
  }
  describe("create", () => {
    it("render", () => {
      const w = mount(Test, {
        propsData: { foo: "fooValue" },
        scopedSlots: {
          default(prop: string) {
            return <span>{prop}</span>;
          }
        }
      });
      expect(w.html()).toBe("<div><span>fooValue</span></div>");
    });
    it("event should be emitted with name without `on` prefix", () => {
      const w = mount(Test, {
        propsData: { foo: "fooValue" }
      });
      w.vm.emitCustomEvent("emit-test");
      expect(w.emittedByOrder()).toStrictEqual([
        { name: "customEvent", args: ["emit-test"] }
      ]);
    });
  });
});
