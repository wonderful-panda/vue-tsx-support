import Vue, { VNode } from "vue";
import { modifiers as m } from "vue-tsx-support";

function modifiers() {
  <div onClick={m.prevent} />;
  <div onClick={m.prevent(_ => {})} />;
  <div onClick={m.prevent.stop} />;
  <div onKeydown={m.esc(e => console.log(e.keyCode))} />;
  <div onKeydown={m.enter(e => console.log(e.keyCode))} />;
  <div onKeydown={m.enter.prevent} />;
  <div onKeydown={m.ctrl.noshift.noalt.nometa} />;
  <div onKeydown={m.keys("left", "right", "up", "down")} />;
  <div onKeydown={m.keys("enter", 67)} />;
  <div onKeydown={m.keys("left", "right", "up", "down")(e => console.log(e.keyCode))} />;
  <div onKeydown={m.exact("ctrl", "alt", "shift", "meta")} />;
  <div onKeydown={m.exact("ctrl", "alt", "shift", "meta")(e => console.log(e.keyCode))} />;

  // each modifiers can be specified only once
  <div
    onClick={
      // @ts-expect-error
      m.prevent.prevent
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.left.left
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.left.alt.left
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.enter.enter
    }
  />;

  // key modifier can be specified only once
  <div
    onKeydown={
      // @ts-expect-error
      m.enter.esc
    }
  />;
  <div
    onKeydown={m.enter
      // @ts-expect-error
      .keys("esc")}
  />;
  <div
    onKeydown={
      // @ts-expect-error
      m.keys("up", "down", "left", "right").enter
    }
  />;

  // mouse button modifier can be specified only once
  <div
    onClick={
      // @ts-expect-error
      m.left.right
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.middle.left
    }
  />;

  // key modifier and mouse button modifier can't be specified together
  <div
    onClick={
      // @ts-expect-error
      m.enter.middle
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.middle.enter
    }
  />;

  // xxx and noxxx can't be specified together
  <div
    onClick={
      // @ts-expect-error
      m.ctrl.noctrl
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.noctrl.ctrl
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.shift.noshift
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.noshift.shift
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.alt.noalt
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.noalt.alt
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.meta.nometa
    }
  />;
  <div
    onClick={
      // @ts-expect-error
      m.nometa.meta
    }
  />;
  // 'exact' and other modkey can't be specified together
  <div
    onClick={
      // @ts-expect-error
      m.exact("ctrl", "alt").ctrl
    }
  />;
  <div
    onClick={m.ctrl
      // @ts-expect-error
      .exact("ctrl", "alt")}
  />;
  <div
    onClick={m.ctrl.shift
      // @ts-expect-error
      .exact("ctrl", "alt")}
  />;
}
