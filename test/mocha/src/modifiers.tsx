import assert from "power-assert";
import { mount } from "@vue/test-utils";
import Vue, { VNode } from "vue";
import { modifiers as m } from "../../..";

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
        const accepted = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return <div onKeydown={m.keys("up", "left")(e => accepted.push(keyNames[e.keyCode]))} />;
            }
        });
        const w = mount(Comp);
        w.trigger("keydown.up");
        w.trigger("keydown.down");
        w.trigger("keydown.left");
        w.trigger("keydown.right");
        assert.deepEqual(accepted, ["up", "left"]);
    });
    it("left/right (keyboard or mouse)", () => {
        const keysL = [] as string[];
        const buttonsL = [] as string[];
        const keysR = [] as string[];
        const buttonsR = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return (
                    <div>
                        <div
                            class="left"
                            onKeydown={m.left(e => keysL.push(keyNames[e.keyCode]))}
                            onClick={m.left(e => buttonsL.push(buttonNames[e.button]))}
                        />
                        <div
                            class="right"
                            onKeydown={m.right(e => keysR.push(keyNames[e.keyCode]))}
                            onClick={m.right(e => buttonsR.push(buttonNames[e.button]))}
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
        assert.deepEqual(keysL, ["left"]);
        assert.deepEqual(buttonsL, ["left"]);

        r.trigger("keydown.left");
        r.trigger("keydown.right");
        r.trigger("click", { button: 0 });
        r.trigger("click", { button: 2 });
        assert.deepEqual(keysR, ["right"]);
        assert.deepEqual(buttonsR, ["right"]);
    });
    it("prevent before", () => {
        const result = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return <div onKeydown={m.prevent.space} />;
            }
        });
        const w = mount(Comp);
        w.trigger("keydown.space", {
            preventDefault() {
                result.push("preventDefault:space");
            }
        });
        w.trigger("keydown.enter", {
            preventDefault() {
                result.push("preventDefault:enter");
            }
        });
        assert.deepEqual(result, ["preventDefault:space", "preventDefault:enter"]);
    });
    it("prevent after", () => {
        const result = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return <div onKeydown={m.space.prevent} />;
            }
        });
        const w = mount(Comp);
        w.trigger("keydown.space", {
            preventDefault() {
                result.push("preventDefault:space");
            }
        });
        w.trigger("keydown.enter", {
            preventDefault() {
                result.push("preventDefault:enter");
            }
        });
        assert.deepEqual(result, ["preventDefault:space"]);
    });
    it("stop before", () => {
        const propagated = [] as string[];
        const result = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return (
                    <div onKeydown={e => propagated.push(keyNames[e.keyCode])}>
                        <div class="inner" onKeydown={m.stop.enter(e => result.push(keyNames[e.keyCode]))} />
                    </div>
                );
            }
        });
        const w = mount(Comp);
        const inner = w.find(".inner");
        inner.trigger("keydown.up");
        inner.trigger("keydown.enter");
        inner.trigger("keydown.space");
        assert.deepEqual(result, ["enter"]);
        // all keydown events are not propagated
        assert.deepEqual(propagated, []);
    });
    it("stop after", () => {
        const propagated = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return (
                    <div onKeydown={e => propagated.push(keyNames[e.keyCode])}>
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
        assert.deepEqual(propagated, ["up", "space"]);
    });
    it("exact", () => {
        const accepted = [] as string[];
        const Comp = Vue.extend({
            render(): VNode {
                return <div onKeydown={m.exact("ctrl", "alt")(e => accepted.push(keyNames[e.keyCode]))} />;
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
        assert.deepEqual(accepted, ["left"]);
    });
});
