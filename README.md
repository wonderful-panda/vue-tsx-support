[![Build Status](https://travis-ci.org/wonderful-panda/vue-tsx-support.svg?branch=master)](https://travis-ci.org/wonderful-panda/vue-tsx-support)

# vue-tsx-support
TSX (JSX for TypeScript) support library for Vue

## Table of contents

<!-- toc -->

- [BREAKING CHANGES](#breaking-changes)
- [Install and enable](#install-and-enable)
- [Using intrinsic elements](#using-intrinsic-elements)
- [Using custom component](#using-custom-component)
  * [available APIs to add type information](#available-apis-to-add-type-information)
    + [componentFactory](#componentfactory)
    + [component](#component)
    + [extendFrom](#extendfrom)
    + [mixin](#mixin)
    + [componentFactoryOf](#componentfactoryof)
    + [Component](#component)
    + [ofType](#oftype)
  * [Other attributes](#other-attributes)
    + [Native event listeners and dom properties](#native-event-listeners-and-dom-properties)
    + [HTML attributes attached to the root element](#html-attributes-attached-to-the-root-element)
- [Options](#options)
  * [allow-element-unknown-attrs](#allow-element-unknown-attrs)
  * [allow-unknown-props](#allow-unknown-props)
  * [enable-html-attrs](#enable-html-attrs)
  * [enable-nativeon](#enable-nativeon)
  * [enable-vue-router](#enable-vue-router)
- [Utility](#utility)
  * [modifiers](#modifiers)
    + [Available modifiers](#available-modifiers)
- [LICENSE](#license)

<!-- tocstop -->

## BREAKING CHANGES
- V2.2.0
  - Disallow meaningless combination of modifiers(undocumented api).

    ```typescript
    import { modifiers as m } from "vue-tsx-support";

    /*
     * Below combinations are all disallowed
     */

    // repeating same modifier
    <div onClick={m.enter.enter(/* snip */)} />;
    <div onClick={m.prevent.prevent(/* snip */)} />;
    <div onClick={m.enter.ctrl.enter(/* snip */)} />;

    // multiple key names.
    // # what you want may be `m.keys("enter", "asc")`
    <div onKeydown={m.enter.esc(/* snip */)} />;

    // multiple buttons
    <div onMousedown={m.left.middle(/* snip */)} />

    // using key name and button togetter
    <div onKeydown={m.enter.middle(/* snip */)} />

    // xxx and noxxx
    <div onClick={m.ctrl.noctrl(/* snip */)} />
    ```

- V2.1.0
  - When event type is function, vue-tsx-support treat it as event handler itself (to support events with multiple parameters).
    ```typescript
    type Events = {
        onOk: string,   // equivalent to `(arg: string) => void`
        onError: (target: any, detail: string) => void
    };
    ```

    if you want to use function as a parameter, you must fix code like below.

    ```typescript
    type Wrong = {
        onOk: () => void
    };
    type Right = {
        onOk: (callback: (() => void)) => void
    }
    ```
- V2.0.0
  - Support Vue >= 2.5.13 only
  - Support TypeScript >= 2.8 only

- v1.0.0
  - Support Vue >= 2.5 only.
  - `createComponent` is deprecated. use [componentFactory](#componentfactory) or [component](#component) instead.

- v0.5.0:
  - Rename `extend` to `extendFrom` (undocumented api)

- v0.4.0:
  - The way to enable compiler check has changed. See [Install and enable](#Install-and-enable)

## Install and enable

Install from npm:

```
npm install vue-tsx-support -S
```

And refer `vue-tsx-support/enable-check.d.ts` from somewhere to enable compiler check. (**CHANGED since v0.4.0**)

```typescript
///<reference path="node_modules/vue-tsx-support/enable-check.d.ts" />
// or
import "vue-tsx-support/enable-check"
```

or in `tsconfig.json`

```json
{
  "compilerOptions": {
    "...snip...": "...snip..."
  },
  "include": [
    "node_modules/vue-tsx-support/enable-check.d.ts",
    "...snip..."
  ]
}
```

## Using intrinsic elements

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

## Using custom component

By default, `vue-tsx-support` does not allow unknown props.

For example, if you have this component :

```typescript
import Vue from "vue";

const MyComponent = Vue.extend({
    props: {
        text: { type: String, required: true },
        important: Boolean,
    },
    computed: {
        className() {
            return this.important ? "label-important" : "label-normal";
        }
    },
    methods: {
        onClick(event) { this.$emit("ok", event); }
    },
    template: "<span :class='className' @click='onClick'>{{ text }}</span>"
});
```

Below code will cause compilation error because compiler does not know
`MyComponent` has prop `text`.

```jsx
// Compilation error(TS2339): Property `text` does not exist on type '...'
<MyComponent text="foo" />;
```

You must add types to the component by apis memtions below, or enable `allow-unknown-props` option.

### available APIs to add type information

#### componentFactory

Create tsx-supported component from component options. (Partially compatible with `Vue.extend`)

```jsx
import * as tsx from "vue-tsx-support";
const MyComponent = tsx.componentFactory.create({
    props: {
        text: { type: String, required: true },
        important: Boolean,
    },
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

`componentFactory.create` can infer types of props from component options same as `Vue.extend`.
In the above example, props type will be `{ text?: string, important?: boolean }`.

:warning: all props are regarded as optional even if `required: true` specified.

```jsx
// both `text` and `important` are regarded as optional
// So below 3 cases are all valid.
<MyComponent />;
<MyComponent text="foo" />;
<MyComponent important={true} />;
```

But `text` is required actually, you may think compilation should be failed when text is not specified.
There are sevaral ways to achieve it.

1. Instead of `required: true`, specify `required: true as true`.
 This turns type of `required` boolean to 'true',
 and vue-tsx-support can know it is required in compile time.

```typescript
import * as tsx from "vue-tsx-support";
const MyComponent = tsx.componentFactory.create({
    props: {
        text: { type: String, required: true as true },
        important: Boolean,
    },
    /* snip */
});
```

FYI, [vue-strict-prop](https://github.com/wonderful-panda/vue-strict-prop) make this easy.

```typescript
import * as tsx from "vue-tsx-support";
import p from "vue-strict-prop";
const MyComponent = tsx.componentFactory.create({
    props: {
        text: p(String).required,
        important: Boolean,
    },
    /* snip */
});
```

2. Specify required prop names as second argument

```typescript
import * as tsx from "vue-tsx-support";
const MyComponent = tsx.componentFactory.create({
    props: {
        text: { type: String, required: true },
        important: Boolean,
    },
    /* snip */
}, ["text"]);
```

In above examples, props type will be `{ text: string, important?: boolean }`.

```jsx
// NG: `text` is required
<MyComponent />;
<MyComponent important={true} />;
```

:warning: shorthand props definition(like `props: ["foo", "bar"]`) is currently not supported.

```typescript
// Does not work
import * as tsx from "vue-tsx-support";
const MyComponent = tsx.componentFactory.create({
    props: ["text", "important"],
    /* snip */
});
```

#### component
Shorthand of `componentFactory.create`

```typescript
import * as tsx from "vue-tsx-support";
const MyComponent = tsx.component({
    props: {
        text: { type: String, required: true },
        important: Boolean,
    },
    /* snip */
});
```

#### extendFrom
When you want to extend your component from other than `Vue`, you can use `extendFrom`

```jsx
import * as tsx from "vue-tsx-support";

// This is equivalent to `const MyComponent = Base.extend({ /* snip */ });`
const MyComponent = tsx.extendFrom(Base).create({
    /* snip */
});
```

#### mixin
You can use `mixin` to add mixin type-safely.

```jsx
import * as tsx from "vue-tsx-support";

const StorageMixin = {
    methods: {
        getItem(string name): string {
            return localStorage.getItem(name);
        },
        setItem(string name, string value): void {
            localStorage.setItem(name, value);
        }
    }
}

const MyComponent = tsx.componentFactory.mixin(StorageMixin).create(
    // You can use this.getItem and this.setItem here
    {
        props: {
            name: String
        },
        data() {
            return { value: "" }
        },
        mounted() {
            this.value = this.getItem(this.name);
        },
        render(): VNode {
            return (
                <button onClick={() => this.setItem(this.name, this.value)}>
                    SAVE
                </button>
            );
        }
    }
);

// You can add 2 or more mixins by method chain
const tsx.componentFactory.mixin(FirstMixin).mixin(SecondMixin).create({
    /* snip */
})
```

#### componentFactoryOf
Return componentFactory with additional types (events and scoped slots)

If your component has custom events, you may want to specify event listener.
But below example does not work.

```jsx
import * as tsx from "vue-tsx-support";

const MyComponent = tsx.component({
    render(): VNode {
        return <button onClick={this.$emit("ok")}>OK</button>;
    }
});

// Compilation error: 'onOK' is not a property of MyComponent
<MyComponent onOk={() => console.log("ok")} />;
```

In such situations, you must specify event types by `componentFactoryOf`

```typescript
import * as tsx from "vue-tsx-support";

interface Events {
    // all memebers must be prefixed by 'on'
    onOk: () => void;
    // If event handler has only one parameter, you can specify parameter type as a shorthand.
    // For example, this is equivalent to `onError: (arg: { code: number, detail: string }) => void`
    onError: { code: number, detail: string };
}

const MyComponent = tsx.componentFactoryOf<Events>().create({
    render(): VNode {
        return (
            <div>
              <button onClick={() => this.$emit("ok")}>OK</button>
              <button onClick={() => this.$emit("error", { code: 9, detail: "unknown" })}>Raise Error</button>
            </div>
        );
    }
});

// OK
<MyComponent onOk={() => console.log("ok")} />;
<MyComponent onError={p => console.log("ng", p.code, p.detail)} />;
```

You can also specify types of scoped slots if your component uses it.

```typescript
import * as tsx from "vue-tsx-support";

interface ScopedSlots {
    default: { text: string };
    optional?: string;
}

const MyComponent = tsx.componentFactoryOf<{}, ScopedSlots>().create({
    props: {
        text: String
    },
    render(): VNode {
        // type of `$scopedSlots` is checked statically
        const { default, optional } = this.$scopedSlots;
        return <ul>
                 <li>{ default({ text: this.text || "default text" }) }</li>
                 <li>{ optional ? optional(this.text) : this.text }<li>
               </ul>;
    }
});

// type of `scopedSlots` is checked statically, too
// 'default' is requred, 'optional' is optional
<MyComponent scopedSlots={{
        default: p => <span>p.text</span>
    }}
/>;

// NG: 'default' is missing in scopedSlots
<MyComponent scopedSlots={{
        optional: p => <span>p</span>
    }}
/>;
```

#### Component
Base class of class base component

If you write your component with `vue-class-component`,
you can it tsx-supported by extending from this class.

```typescript
import component from "vue-class-component";
import * as tsx from "vue-tsx-support";

interface MyComponentProps {
    text: string;
    important?: boolean;
}

@component({
    props: {
        text: { type: String, required: true },
        important: Boolean
    },
    /* snip */
})
class MyComponent extends tsx.Component<MyComponentProps> {
    /* snip */
}
```

Unfortunately, you must write props interface and props definition separately.

If you want, you can specify event types and scoped slot types as 2nd and 3rd type parameter

```typescript
import component from "vue-class-component";
import * as tsx from "vue-tsx-support";

interface MyComponentProps {
    text: string;
    important?: boolean;
}

interface Events {
    onOk: void;
    onError: { code: number, detail: string };
}

interface ScopedSlots {
    default: { text: string };
}


@component({
    props: {
        text: { type: String, required: true },
        important: Boolean
    },
    /* snip */
})
class MyComponent extends tsx.Component<MyComponentProps, Events, ScopedSlots> {
    /* snip */
}
```

#### ofType

Make existing component tsx-supported.

If you can't modify existing component definition, wrap it by `ofType` and `convert`

```typescript
import ThirdPartyComponent from "third-party-library";
import * as tsx from "vue-tsx-support";

interface MyComponentProps { /* ... */ }

const MyComponent = tsx.ofType<MyComponentProps>().convert(ThirdPartyComponent);
```

Of course you can specify event types and scoped slot types if you want.

```typescript
const MyComponent = tsx.ofType<MyComponentProps, Events, ScopedSlots>().convert(ThirdPartyComponent);
```

### Other attributes

#### Native event listeners and dom properties

Sometimes you may want to specify native event listener or dom property to the component like below.
But unfortunately, `vue-tsx-support` does not support this.

```jsx
// NG: because `nativeOnClick` is not a prop of MyComponent
<MyComponent text="foo" nativeOnClick={ ... } />
// NG: because `domPropInnerHTML` is not a prop of MyComponent
<MyComponent text="foo" domPropInnerHTML={ ... } />
```

To avoid compilation error, you must use kebab-case attribute name.

```jsx
// OK
<Component nativeOn-click={ ... } />
// OK
<Component domProp-innerHTML={ ... } />
```

Or use JSX-spread style.

```jsx
// OK
<Component { ...{ nativeOn: { click: ... } } } />
// OK
<Component { ...{ domProps: { innerHTML: ... } } } />
```

For native events, there is an another solution. See `enable-nativeon` option.

#### HTML attributes attached to the root element

And sometimes, you may want to specify HTML attributes to the component like below.
But unfortunately, `vue-tsx-support` does not support this, too.

```jsx
// NG: because `min` and `max` are not props of SomeInputComponent
<SomeInputComponent min={ 0 } max={ 100 } />
```

To avoid compilation error, you must use JSX-spread style.

```jsx
// OK
<SomeInputComponent { ...{ attrs: { min: 0, max: 100 } } } />
```

Or enable `enable-html-attributes` option.

## Options

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

## Utility

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
