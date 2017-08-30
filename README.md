# vue-tsx-support (EXPERIMENTAL)
TSX (JSX for TypeScript) support library for Vue

## Setup

To enable this library, import this somewhere.

```typescript
import "vue-tsx-support"
// OR
///<reference types="vue-tsx-support" />
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

You must add types to the component, or enable `allow-unknown-props` option.

### Adding types of the props

There are sevarel ways to add types to the component.

If you write your component with `Vue.extend`,
use `vue-tsx-support.createComponent` instead :

```typescript
import * as vuetsx from "vue-tsx-support";

// define interface which represents props of component.
interface MyComponentProps {
    text: string;       // required prop
    important?: string; // optional prop
}

const MyComponent = vuetsx.createComponent<MyComponentProps>({
    props: {
        text: { type: String, required: true },
        important: Boolean,
    },
    /* ... */
});
```

If you write your component with `vue-class-component`,
extend your component from `vue-tsx-support.Component` :

```typescript
import component from "vue-class-component";
import * as vuetsx from "vue-tsx-support";

interface MyComponentProps { /* ... */ }

@component({ /* ... */ })
class MyComponent extends vuetsx.Component<MyComponentProps> {
    /* ... */
}
```

If you can't modify original component definition, wrap it by `ofType` and `convert`:

```typescript
import ThirdPartyComponent from "third-party-library";
import * as vuetsx from "vue-tsx-support";

interface MyComponentProps { /* ... */ }

const MyComponent = vuetsx.ofType<MyComponentProps>().convert(ThirdPartyComponent);
```

Now, compiler knows about props of `MyComponent`, and can check them statically.

```jsx
// OK
<MyComponent text="foo" />;
// OK
<MyComponent text="foo" important />;
// OK: some attributes(e.g. 'ref', 'class', 'key') are defined by default
<MyComponent text="foo" ref="mycomponent" class="my-class" />;

// NG: because required prop `text` is not specified
<MyComponent />;
// NG: because type of `text` is not string
<MyComponent text={ 1 } />;
// NG: because `normal` is not a prop of MyComponent
<MyComponent text="foo" normal={ true } />;
```

### Adding types of custom events

Now, compiler knows about props of `MyComponent`, but this is not enough yet.

`MyComponent` has custom event `ok`, and sometimes we must specify event listener like below.
But this code can't be compiled.

```jsx
// NG: because `onOk` is not a prop of MyComponent
<MyComponent text="foo" onOk={ e => console.log(e) } />;
```

If the component has custom events, you can specify event types as second type parameter,
and above code will become compilable.

```typescript
// define interface which represents component event types
interface MyComponentEvents {
    onOk: Event;    // key: event name prefixed by `on`, value: argument type
}

const MyComponent = vuetsx.createComponent<MyComponentProps, MyComponentEvents>({
    /* ... */
});

// `vuetsx.Compnent` and `vuetsx.ofType` also accept second type parameter
```

## Native event listeners and dom properties

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

## HTML attributes attached to the root element

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

NOTE: Scope of option is whole project, not a file.

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



## LICENSE
MIT
