import { mount } from "@vue/test-utils";
import Vue, { VNode } from "vue";
import { modifiers as m } from "vue-tsx-support";

const buttonNames = ["left", "middle", "right"];

const keyNames: { [key: number]: string } = {
  27: "esc",
  9: "tab",
  13: "enter",
  32: "space",
  38: "up",
  40: "down",
  8: "delete",
  46: "backspace",
  37: "left",
  39: "right"
};
describe("modifiers", () => {
  it("keys", () => {
    const spy = jest.fn();
    const Comp = Vue.extend({
      render(): VNode {
        return <div onKeydown={m.keys("up", "left")(e => spy(keyNames[e.keyCode]))} />;
      }
    });
    const w = mount(Comp);
    w.trigger("keydown.up");
    w.trigger("keydown.down");
    w.trigger("keydown.left");
    w.trigger("keydown.right");
    expect(spy.mock.calls).toEqual([["up"], ["left"]]);
  });
  it("left/right (keyboard or mouse)", () => {
    const keysL = jest.fn();
    const buttonsL = jest.fn();
    const keysR = jest.fn();
    const buttonsR = jest.fn();
    const Comp = Vue.extend({
      render(): VNode {
        return (
          <div>
            <div
              class="left"
              onKeydown={m.left(e => keysL(keyNames[e.keyCode]))}
              onClick={m.left(e => buttonsL(buttonNames[e.button]))}
            />
            <div
              class="right"
              onKeydown={m.right(e => keysR(keyNames[e.keyCode]))}
              onClick={m.right(e => buttonsR(buttonNames[e.button]))}
            />
          </div>
        );
      }
    });
    const w = mount(Comp);
    const [l, r] = [w.find(".left"), w.find(".right")];
    l.trigger("keydown.left");
    l.trigger("keydown.right");
    l.trigger("click", { button: 0 });
    l.trigger("click", { button: 2 });
    expect(keysL.mock.calls).toEqual([["left"]]);
    expect(buttonsL.mock.calls).toEqual([["left"]]);

    r.trigger("keydown.left");
    r.trigger("keydown.right");
    r.trigger("click", { button: 0 });
    r.trigger("click", { button: 2 });
    expect(keysR).toHaveBeenCalledTimes(1);
    expect(keysR).toHaveBeenCalledWith("right");
    expect(buttonsR).toHaveBeenCalledTimes(1);
    expect(buttonsR).toHaveBeenCalledWith("right");
  });
  it("prevent before", () => {
    const Comp = Vue.extend({
      render(): VNode {
        return <div onKeydown={m.prevent.space} />;
      }
    });
    const w = mount(Comp);
    const space = jest.fn();
    const enter = jest.fn();
    w.trigger("keydown.space", {
      preventDefault: space
    });
    w.trigger("keydown.enter", {
      preventDefault: enter
    });
    expect(space).toHaveBeenCalled();
    expect(enter).toHaveBeenCalled();
  });
  it("prevent after", () => {
    const Comp = Vue.extend({
      render(): VNode {
        return <div onKeydown={m.space.prevent} />;
      }
    });
    const w = mount(Comp);
    const space = jest.fn();
    const enter = jest.fn();
    w.trigger("keydown.space", {
      preventDefault: space
    });
    w.trigger("keydown.enter", {
      preventDefault: enter
    });
    expect(space).toHaveBeenCalled();
    expect(enter).not.toHaveBeenCalled();
  });
  it("stop before", () => {
    const propagated = jest.fn();
    const spy = jest.fn();
    const Comp = Vue.extend({
      render(): VNode {
        return (
          <div onKeydown={e => propagated(keyNames[e.keyCode])}>
            <div class="inner" onKeydown={m.stop.enter(e => spy(keyNames[e.keyCode]))} />
          </div>
        );
      }
    });
    const w = mount(Comp);
    const inner = w.find(".inner");
    inner.trigger("keydown.up");
    inner.trigger("keydown.enter");
    inner.trigger("keydown.space");
    expect(spy.mock.calls).toEqual([["enter"]]);
    // all keydown events are not propagated
    expect(propagated).not.toHaveBeenCalled();
  });
  it("stop after", () => {
    const propagated = jest.fn();
    const Comp = Vue.extend({
      render(): VNode {
        return (
          <div onKeydown={e => propagated(keyNames[e.keyCode])}>
            <div class="inner" onKeydown={m.enter.stop} />
          </div>
        );
      }
    });
    const w = mount(Comp);
    const inner = w.find(".inner");
    inner.trigger("keydown.up");
    inner.trigger("keydown.enter");
    inner.trigger("keydown.space");
    // keydown.enter is not propagated
    expect(propagated.mock.calls).toEqual([["up"], ["space"]]);
  });
  it("exact", () => {
    const spy = jest.fn();
    const Comp = Vue.extend({
      render(): VNode {
        return <div onKeydown={m.exact("ctrl", "alt")(e => spy(keyNames[e.keyCode]))} />;
      }
    });
    const w = mount(Comp);
    w.trigger("keydown.up", {
      ctrlKey: true
    });
    w.trigger("keydown.down", {
      altKey: true
    });
    w.trigger("keydown.left", {
      ctrlKey: true,
      altKey: true
    });
    w.trigger("keydown.right", {
      ctrlKey: true,
      shiftKey: true,
      altKey: true
    });
    expect(spy.mock.calls).toEqual([["left"]]);
  });
});
