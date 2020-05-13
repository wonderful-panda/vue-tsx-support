[![Build Status](https://travis-ci.org/wonderful-panda/vue-tsx-support.svg?branch=master)](https://travis-ci.org/wonderful-panda/vue-tsx-support)

# vue-tsx-support
TSX (JSX for TypeScript) support library for Vue

## :warning: CAUTION

__This is the document for beta version (v3.0.0-beta)__

Stable version is [here](https://github.com/wonderful-panda/vue-tsx-support/blob/v2/README.md)

If your project already uses vue-tsx-support v2, see [Migration from V2](#migration-from-v2) section.

## TABLE OF CONTENTS

## NEW FEATURES

- Typesafe emit for declared events
- @vue/composition-api support (experimental)

## INSTALLATION

1. Create Vue project with TypeScript and babel support.

    vue-tsx-support is a type checker for TypeScript, not a transpiler.  
    You must install babel presets (@vue/babel-preset-app or @vue/babel-preset-jsx) separatedly.

    Vue CLI may help you.

    - [Installation - Vue.js](https://vuejs.org/v2/guide/installation.html)
    - [Vue CLI](https://cli.vuejs.org/)
    - [vuejs/jsx](https://github.com/vuejs/jsx)

    :bulb: If you want use @vue/composition-api, [babel-preset-vue-vca](https://github.com/luwanquan/babel-preset-vca-jsx) is also needed.

2. Install vue-tsx-support from npm

    ```
    yarn add vue-tsx-support@beta -D
    ```

3. In `tsconfig.json`, set `"preserve"` to `jsx` and `"VueTsxSupport"` to `jsxFactory`

    ```json
    {
      "compilerOptions": {
        "jsx": "preserve",
        "jsxFactory": "VueTsxSupport",
        "...": "..."
      },
      "include": [
        "..."
      ]
    }
    ```

4. import `vue-tsx-support/enable-check.d.ts` somewhere, 

    ```typescript
    import "vue-tsx-support/enable-check"
    ```

    or add it to "include" in `tsconfig.json`

    ```json
    {
      "compilerOptions": {
        "...": "..."
      },
      "include": [
        "node_modules/vue-tsx-support/enable-check.d.ts",
        "..."
      ]
    }
    ```

### Migration from V2

1. In `tsconfig.json`, set `"VueTsxSupport"` to `jsxFactory`

2. Enable `allow-props-object` option (Optional)


## USAGE

### Intrinsic elements

Standard HTML elements are defined as intrinsic elements.
So, compiler can check attribute names and attribute types of them:

```jsx
// OK
<div id="title" />;
// OK
<input type="number" min={ 0 } max={ 100 } />;
// OK
<a href={ SOME_LINK } />;
// NG: because `href` is not a valid attribute of `div`
<div href={ SOME_LINK } />;
// NG: because `id` must be a number
<div id={ 1 } />;
```

Lower case tags are treated as unknown intrinsic element.
TypeScript checks nothing for such tags.

```jsx
// OK
<foo id="unknown" unknownattr={ 1 } />
```

### Components

Basically, `vue-tsx-support` checks three types for each component.

- __Prop types__  
   Determine name, type, and required or optional of each props.  
   When using existing component as-is, you must specify prop types manually.  
   When writing component with APIs of `vue-tsx-support`, prop types are automatically obtained from component definition.  

- __Custom event types (optional)__  
   If the component has custom events, you can specify custom event types additionally,  
   and `vue-tsx-support` will check if event names and argument types are correct or not.

- __Scoped slot types (optional)__  
   If the component has uses scoped slots, you can specify scoped slot types additionally,  
   and `vue-tsx-support` will check if scoped slot names and argument types are correct or not.

#### Make existing components tsx-ready.

By default, `vue-tsx-support` does not allow unknown props.  
For example, below code causes compilation error.

  ```jsx
  import Vue from "vue";
  import AwesomeButton from "third-party-library/awesome-button";

  export default Vue.extend({
    render() {
      // ERROR: because TypeScript does not know that AwesomeButton has 'text' prop.
      return <AwesomeButton text="Click Me!" />;
    }
  });
  ```

You can add type information to existing component without modifying component itself, like below:

  ```typescript
  import AwesomeButtonOrig from "third-party-library/awesome-button";
  import * as tsx from "vue-tsx-support";

  type AwesomeButtonProps = {
    text: string;
    raised?: boolean;
    rounded?: boolean;
  }

  // Now, AwesomeButton has 1 required prop(text) and 2 optional props(raised, rounded)
  export const AwesomeButton = tsx.ofType<AwesomeButtonProps>().convert(AwesomeButtonOrig);
  ```

You also can specify custom event types as second type parameter, and scoped slot types as third type parameter.

For example:

  ```typescript
  import AwesomeListOrig from "third-party-library/awesome-list";
  import * as tsx from "vue-tsx-support";

  type Item = { id: string, text: string };

  type AwesomeListProps = {
    items: ReadonlyArray<Item>;
    rowHeight: number;
  }

  type AwesomeListEvents = {
    // member name must be ['on' + event name(with capitalizing first charactor)]
    onRowClicked: { item: Item, index: number };
  }

  type AwesomeListScopedSlots = {
    row: { item: Item }
  }

  export const AwesomeList = tsx.ofType<
    AwesomeListProps,
    AwesomeListEvents,
    AwesomeListScopedSlots
  >().convert(AwesomeListOrig);
  ```

Then you can use AwesomeList like below:

  ```jsx
  const App = Vue.extend({
  render(): VNode {
    return (
      <AwesomeList
        items={this.items}
        rowHeight={32}
        onRowClicked={p => console.log(`${p.item.text} clicked!`)}
        scopedSlots={{
          row: item => <div>{item.text}</div>
        }}
      />
    );
  }
  });
  ```

#### Writing components by object-style API (Like `Vue.extend`)

If you use `Vue.extend()`, just replace it by `componentFactory.create` and your component becomes TSX-ready.

Props type is infered from props definition automatically.  
For example, props type will be `{ text: string, important?: boolean }` in below code.

:warning: In some environment, `as const` may be needed to make prop required properly.

  ```jsx
  import * as tsx from "vue-tsx-support";
  const MyComponent = tsx.componentFactory.create({
    props: {
      text: { type: String, required: true },
      important: Boolean,
    } as const, // `as const` is needed in some cases.
    computed: {
      className(): string {
        return this.important ? "label-important" : "label-normal";
      }
    },
    methods: {
      onClick(event) { this.$emit("ok", event); }
    },
    render(): VNode {
      return <span class={this.className} onClick={this.onClick}>{this.text}</span>;
    }
  });
  ```

:bulb: You can use `component` as as shorthand of `componentFactory.create`.

  ```jsx
  import * as tsx from "vue-tsx-support";
  const MyComponent = tsx.component({
    /* snip */
  });
  ```

If your component has custom events or scoped slots, use `componentFactoryOf` instead.

  ```typescript
  import * as tsx from "vue-tsx-support";

  type AwesomeListEvents = {
    onRowClicked: { item: {}, index: number };
  }

  type AwesomeListScopedSlots = {
    row: { item: {} }
  }

  export const AwesomeList = tsx.componentFactoryOf<
    AwesomeListEvents,
    AwesomListScopedSlots
  >().create({
    name: "AwesomeList",
    props: {
      items: { type: Array, required: true },
      rowHeight: { type: Number, required: true }
    },
    computed: { /* ... */},
    method: {
      emitRowClicked(item: {}, index: number): void {
        // Equivalent to `this.$emit("rowClicked", { item, index })`,
        // And event name and payload type are statically checked.
        tsx.emitOn(this, "onRowClicked", { item, index });
      }
    },
    render(): VNode {
      return (
        <div class={style.container}>
          {
            this.visibleItems.map((item, index) => (
              <div style={this.rowStyle} onClick={() => this.$emit("rowClicked", { item, index })}>
                {
                  // slot name ('row') and argument types are statically checked.
                  this.$scopedSlots.row({ item })
                }
              <div>
            )
          }
        </div>
      );
    }
  });
  ```

#### Writing component by class-style API (`vue-class-component` and/or `vue-property-decorator`)

If you prefer class-style component by using `vue-class-component` and/or `vue-property-decorator`,
there are some options to make it tsx-ready.

##### 1. Extends from `Component` class provided by `vue-tsx-support`

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  type MyComponentProps {
    text: string;
    important?: boolean;
  }

  @Component
  export class MyComponent extends tsx.Component<MyComponentProps> {
    @Prop({ type: String, required: true })
    text!: string;
    @Prop(Boolean)
    important?: boolean;

    get className() {
      return this.important ? "label-important" : "label-normal";
    }
    onClick(event: MouseEvent) {
      this.$emit("ok", event);
    }
    render(): VNode {
      return <span class={this.className} onClick={this.onClick}>{this.text}</span>;
    }
  }
  ```

  :warning: Unfortunately, `vue-tsx-support` can't infer prop types automatically in this case, so you must write type manually.

##### 2. Add `_tsx` field to tell type information to TypeScript.

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: {
      // specify props type to `props`.
      props: Pick<MyComponent, "text" | "important">
    };

    @Prop({ type: String, required: true })
    text!: string;
    @Prop(Boolean)
    important?: boolean;

    get className() {
      return this.important ? "label-important" : "label-normal";
    }
    render(): VNode {
      return <span class={this.className}>{this.text}</span>;
    }
  }
  ```

  You can use `DeclareProps<T>` instead of `{ props: T }`.

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: tsx.DeclareProps<Pick<MyComponent, "text" | "important">>;

    /* ...snip... */
  }
  ```

  :bulb: `PickProps` is more convenient than `Pick` here, it removes attributes from `Vue` from completion candidates. (e.g. `$data`, `$props`, and so on)

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: tsx.DeclareProps<tsx.PickProps<MyComponent, "text" | "important">>;

    /* ...snip... */
  }
  ```

  :bulb: When you can make all data, computed and methods private, you can use `AutoProps` instead.  
  `AutoProps` picks all public members other than members from component options(`render`, `created` etc).
  
  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: tsx.DeclareProps<tsx.AutoProps<MyComponent>>

    @Prop({ type: String, required: true })
    text!: string;

    @Prop(Boolean)
    important?: boolean;

    // data
    private count = 0;
    // computed
    private get className() {
      return this.important ? "label-important" : "label-normal";
    }
    // methods
    private onClick() {
      this.count += 1;
    }

    render(): VNode {
      return (
        <span class={this.className} onClick={this.onClick}>
          {`${this.text}-${this.count}`}
        </span>
      );
    }
  }
  ```

  :bulb: If your component has custom events, you can specify events handlers type additionally.

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: tsx.DeclareProps<PickProps<MyComponent, "text" | "important">> &
      tsx.DeclareOnEvents<{ onOk: string }>;

    /* ...snip... */
  }
  ```

  :bulb: If your component uses scoped slots, you should add type to `$scopedSlots` by `tsx.InnerScopedSlots`.

  ```jsx
  import { Component, Prop } from "vue-property-decorator";
  import * as tsx from "vue-tsx-support";

  @Component
  export class MyComponent extends Vue {
    _tsx!: tsx.DeclareProps<PickProps<MyComponent, "text" | "important">>;

    $scopedSlots!: tsx.InnerScopedSlots<{ default?: string }>;

    /* ...snip... */
  }
  ```

#### Writing component by composition api (`@vue/composition-api`)

At this point, `vue-next` is not supported, `@vue/composition-api` and `babel-preset-vca-jsx` are needed instead.

To make TSX-ready component by composition api, use `component` of `vue-tsx-support/lib/vca` instead of `createComponent` of `@vue/composition-api`.

  ```jsx
  import { computed } from "@vue/composition-api";
  import * as vca from "vue-tsx-support/lib/vca";

  const MyComponent = vca.component({
    name: "MyComponent",
    props: {
      text: { type: String, required: true },
      important: Boolean,
    },
    setup(p) {
      const className = computed(() => p.important ? "label-important" : "label-normal");
      return () => (
        <span class={className.value}>{p.text}</span>;
      );
    }
  });
  ```

If your component has custom event or scoped slots, specify them types in 2nd argument of `setup`.

  ```jsx
  import { computed, onMounted } from "@vue/composition-api";
  import * as vca from "vue-tsx-support/lib/vca";

  type AwesomeListEvents = {
    onRowClicked: { item: {}, index: number };
  }

  type AwesomeListScopedSlots = {
    row: { item: {} }
  }

  export const AwesomeList = vca.component({
    name: "AwesomeList",
    props: {
      items: { type: Array, required: true },
      rowHeight: { type: Number, required: true }
    },
    setup(p, ctx: vca.SetupContext<AwesomeListEvents, AwesomeListScopedSlots>) {
      const visibleItems = computed(() => ... );
      const emitRowClicked = (item: {}, index: number) => {
        // Equivalent to `ctx.emit("rowClicked", { item, index })`,
        // And event name and payload type are statically checked.
        vca.emitOn(ctx, "onRowClicked", { item, index });
      }

      return () => (
        <div class={style.container}>
          {
            visibleItems.value.map((item, index) => (
              <div onClick={() => emitRowClicked(item, index)}>
                {
                  // slot name ('row') and argument types are statically checked.
                  ctx.slots.row({ item })
                }
              <div>
            )
          }
        </div>
      );
    }
  });
  ```

## OPTIONS

`vue-tsx-support` has some options which change behaviour globally.
See under the `options` directory.

To enable each options, import them somewhere

```typescript
// enable `allow-unknown-props` option
import "vue-tsx-support/options/allow-unknown-props";
```

:warning: Scope of option is whole project, not a file.

### allow-element-unknown-attrs

Make enabled to specify unknown attributes to intrinsic elements

```jsx
// OK:`foo` is unknown attribute, but can be compiled
<div foo="foo" />;
```

### allow-unknown-props

Make enabled to specify unknown props to Vue component.

```jsx
const MyComponent = vuetsx.createComponent<{ foo: string }>({ /* ... */ });
// OK: `bar` is unknown prop, but can be compiled
<MyComponent foo="foo" bar="bar" />;
```

### enable-html-attrs

Make enabled to specify HTML attributes to Vue component.

```jsx
const MyComponent = vuetsx.createComponent<{ foo: string }>({ /* ... */ });
// OK: `min` and `max` are valid HTML attributes
<MyComponent foo="foo" min={ 0 } max={ 100 } />;
// NG: compiler checks type of `min` (`min` must be number)
<MyComponent foo="foo" min="a" />;
```

### enable-nativeon

Make enabled to specify native event listeners to Vue component.

```jsx
const MyComponent = vuetsx.createComponent<{ foo: string }>({ /* ... */ });
// OK
<MyComponent foo="foo" nativeOnClick={ e => ... } />; // and `e` is infered as MouseEvent
```

### enable-vue-router

Add definitions of `router-link` and `router-view`

### allow-props-object

Make enabled to pass props as "props".

```jsx
const MyComponent = vuetsx.createComponent<{ foo: string }>({ /* ... */ });
// OK
<MyComponent props={{ foo: "foo" }} />;
```

## APIS

### modifiers

Event handler wrappers which work like some event modifiers available in template

```typescript
import { modifiers as m } from "vue-tsx-support";

// Basic usage:
//  Equivalent to `<div @keydown.enter="onEnter" />`
<div onKeydown={m.enter(this.onEnter)} />;

// Use multiple modifiers:
//  Equivalent to `<div @keydown.enter.prevent="onEnter" />`
<div onKeydown={m.enter.prevent(this.onEnter)} />;

// Use without event handler:
//  Equivalent to `<div @keydown.esc.prevent />`
<div onKeydown={m.esc.prevent} />;

// Use multiple keys:
//  Equivalent to `<div @keydown.enter.esc="onEnterOrEsc" />`
<div onKeydown={m.keys("enter", "esc")(this.onEnterOrEsc)} />;

// Use exact modkey combination:
//  Equivalent to `<div @keydown.65.ctrl.alt.exact="onCtrlAltA" />`
<div onKeydown={m.keys(65).exact("ctrl", "alt")(this.onCtrlAltA)} />;
```

#### Available modifiers

* `esc`, `tab`, `enter`, `space`, `up`, `down`, `del`, `left`, `right`

  Execute event handler only when specified key is pressed.  
  :warning: `del` allows not only DELETE, but also BACKSPACE.  
  :warning: `left` and `right` have another behavior when specified to mouse event  
  :warning: combination of key modifiers (e.g. `m.enter.esc`) does not work. See [keys](#keys)  

* `left`, `right`, `middle`

  Execute event handler only when specified mouse button is pressed.  
  :warning: `left` and `right` have another behavior when specified to keyboard event  

* `ctrl`, `shift`, `alt`, `meta`

  Execute event handler only when specified system modifier key is pressed.  

* `noctrl`, `noshift`, `noalt`, `nometa`

  Execute event handler only when specified system modifier key is not pressed.  

* `self`

  Execute event handler only when event.target is the element itself (not from children).  

* `prevent`, `stop`

  Call `preventDefault` or `stopPropagation` of event object before executing event handler.  

<a name="keys"></a>
* `keys(...args)`

  Execute event handler only when one of specified key is pressed.  
  Known key name("esc", "tab", "enter", ...) or number can be specified.  

  ```typescript
  // when enter or esc pressed
  <div onKeydown={m.keys("enter", "esc")(handler)} />;
  // when 'a' pressed
  <div onKeydown={m.keys(65)(handler)} />;
  ```

* `exact(...args)`

  Execute event handler only when specified system modifier keys are all pressed, and others are not pressed.  

  ```typescript
  // when CTRL, SHIFT are both pressed, and ALT, META are both not pressed
  <div onClick={m.exact("ctrl", "shift")(handler)} />;
  ```

## LICENSE

MIT

