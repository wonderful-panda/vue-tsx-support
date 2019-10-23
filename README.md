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
                // slot name ('row') and argument types are statically checked.
                { this.$scopedSlots.row({ item }) }
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

##### 2. Add `tsx_` field to tell type information to TypeScript.

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

If you want to use composition api which will be introduced by Vue V3,
`@vue/composition-api` and `babel-preset-vca-jsx` may help you.

To make TSX-ready component by composition api, use `component` of `vue-tsx-support/lib/vca` instead of `createComponent` of `@vue/composition-api`.

  ```jsx
  import { computed } from "@vue/composition-api";
  import * as vca from "vue-tsx-support/lib/vca";

  const MyComponent = vca.component({
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

## OPTIONS

## APIS

## LICENSE

MIT

<!--

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

-->
