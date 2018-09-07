import { mount, createLocalVue } from "vue-test-utils";
import Component from "vue-class-component";
import Vue, { VNode } from "vue";
import { WithProps, Keys } from "../../../lib/class";

describe("classComponent", () => {
  describe("simple component", () => {
    @Component
    class Test extends WithProps({ foo: String }) {
      get [Keys.Events]() {
        return {
          onOneArgEvent(payload: { code: number; msg: string }) {},
          onMultiArgsEvent(code: number, msg: string) {},
          onNoArgEvent() {}
        };
      }
      get [Keys.ScopedSlots]() {
        return {
          default(_: { content: string }) {}
        };
      }
      render() {
        const ss = this.$scopedSlots;
        return (
          <div>
            {ss.default
              ? ss.default({ content: this.$props.foo })
              : this.$props.foo}
          </div>
        );
      }
    }

    it("render without slot", () => {
      const w = mount(Test, { propsData: { foo: "foo" } });
      expect(w.html()).toBe("<div>foo</div>");
    });

    it("render with slot", () => {
      const w = mount({
        render() {
          return (
            <Test
              foo="foo"
              scopedSlots={{
                default: p => p.content.toUpperCase()
              }}
            />
          );
        }
      });
      expect(w.html()).toBe("<div>FOO</div>");
    });

    it("events", () => {
      const w = mount(Test);
      w.vm.$$emit.onOneArgEvent({ code: 1, msg: "message" });
      w.vm.$$emit.onMultiArgsEvent(1, "message");
      w.vm.$$emit.onNoArgEvent();
      const emitted = w.emitted();
      expect(emitted["oneArgEvent"]).toEqual([[{ code: 1, msg: "message" }]]);
      expect(emitted["multiArgsEvent"]).toEqual([[1, "message"]]);
      expect(emitted["noArgEvent"]).toEqual([[]]);
    });

    describe("extended component", () => {
      @Component
      class Extend extends WithProps({ bar: String }, Test) {
        get [Keys.Events]() {
          return {
            ...super[Keys.Events],
            onExtendedEvent(_arg: string) {}
          };
        }
        render() {
          return <div>{this.foo + " " + this.bar}</div>;
        }
      }

      it("props", () => {
        const w = mount(Extend, { propsData: { foo: "Foo", bar: "Bar" } });
        expect(w.html()).toBe("<div>Foo Bar</div>");
      });

      it("events", () => {
        const w = mount(Extend);
        w.vm.$$emit.onOneArgEvent({ code: 1, msg: "message" });
        w.vm.$$emit.onExtendedEvent("message");
        const emitted = w.emitted();
        expect(emitted["oneArgEvent"]).toEqual([[{ code: 1, msg: "message" }]]);
        expect(emitted["extendedEvent"]).toEqual([["message"]]);
      });
    });
  });
});
