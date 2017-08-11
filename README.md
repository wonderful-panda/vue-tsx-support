# vue-tsx-support
TSX (JSX for TypeScript) support library for Vue

**EXPERIMENTAL**

## Usage

Your components can be used in TSX by default.
This library provides some ways to make your components more type-safe.

### 1. Checking types of reserved attributes

When you write components by standard way, compiler checks only types of reserved attributes.  
e.g. `ref`, `slot`, `staticClass`, ...

```typescript
import Vue from "vue";

const MyComponent = Vue.extend({
    props: {
        text: { type: String, required: true },
        important?: Boolean,
    },
    computed: {
        className: () => this.important ? "label-important" : "label-normal";
    }
    template: "<span :class='className'>{{ text }}</span>"
});
```

```jsx
/****************************
 These are correct code
 ****************************/
<MyComponent text="Hello" />;
<MyComponent text="Hello" ref="my-component" />;

/***************************************************
 This is wrong code. And compiler can detect this.
 ***************************************************/
// `ref` must be string
<MyComponent text="Hello" ref={ 0 } />;     

/******************************************************
 These are also wrong. But compiler doesn't know
 *****************************************************/
// `text` is required
<MyComponent />;                
// `text` must be string
<MyComponent text={ 0 } />;     
```

### 2. Checking types of props

If you want check component props, you can specify type parameter.

```typescript
import Vue from "vue";
import * as tsx from "vue-tsx-support";

// Define interface which represent prop types.
interface Props {
    text: string;           // required prop
    important?: boolean;    // optional prop
}

// Use tsx.createComponent instead of Vue.extend, and specify prop interface
// as a type parameter.
const MyComponent = tsx.createComponent<Props>({
    props: {
        text: { type: String, required: true },
        important?: Boolean,
    },
    computed: {
        className: () => this.important ? "label-important" : "label-normal";
    }
    template: "<span :class='className'>{{ text }}</span>"
});
```

Now, TypeScript compiler checks your component props.

```jsx
/****************************
 These are correct code
 ****************************/
<MyComponent text="Hello" />;
<MyComponent text="Hello" important={ true } />;
// Unknown props can be specified
<MyComponent text="Hello" important={ true } otherProp="value" />;

/***************************************************
 This is wrong code. And compiler can detect them.
 ***************************************************/
// `ref` must be string
<MyComponent ref={ 0 } />;     
// `text` is required
<MyComponent />;                
// `text` must be string
<MyComponent text={ 0 } />;     
// `important` must be boolean
<MyComponent text="Hello" important={ 0 } />;     
```

### 3. Checking types of custom events

If your component also has own events, specify event types as a second type parameter

```typescript
interface Props {
    text: string;           // required prop
}
interface Events {
    // member name : event name prefixed by 'on'
    // member type : event parameter type
    onOk: MouseEvent;
    onCancel: MouseEvent;
}
const MyComponent = tsx.createComponent<Props, Event>({
    props: {
        text: { type: String, required: true }
    },
    template: `
        <div>
            <span>{{ text }}</span>
            <button onClick='$emit("ok", $event)'>OK</button>
            <button onClick='$emit("cancel", $event)'>CANCEL</button>
        </div>
    `
});
```

Now, TypeScript compiler also checks your component events.

```jsx
/****************************
 These are correct code
 ****************************/
<MyComponent text="Hello" />;
<MyComponent text="Hello" onOk={ e => console.log(e) } />;

/***************************************************
 This is wrong code. And compiler can detect them.
 ***************************************************/
// parameter of `onOk` must be MouseEvent
<MyComponent text="Hello" onOk={ (e: KeyboardEvent) => console.log(e.keyCode) } />;
```

### 4. Working with other library

If you use `vue-class-component`, you can specify props type by using `tsx.Component` as a super class

```typescript
import Vue from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

@Component({ /* component options */ })
class MyComponent extends tsx.Component<Props, Event> {
    get className() {
        return this.important ? "label-important" : "label-normal";
    }
});
```

If you can't replace super class for some reason (e.g. because super class is a custom class other than Vue),
you can do same thing by adding field `_tsxattrs`.

```typescript
import { MyComponentBase } from "./base";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

@Component({ /* component options */ })
class MyComponent extends MyComponentBase {
    _tsxattrs: tsx.TsxComponentAttrs<Props, Event>
    get className() {
        return this.important ? "label-important" : "label-normal";
    }
});
```

If you don't want to change implementation of existing components (e.g. when you use 3rd-party components),
you can use `of` and `convert` to give type information to existing components.

```typescript
import { ThirdPartyComponent as BaseComponent } from "third-party-component";
import * as tsx from "vue-tsx-support";

// define interface of props and events by yourself
interface Props {
    text: string;
}
interface Events {
    onOk: string;
}

// and give types to existing component
const ThirdPartyComponent = tsx.of<Props, Events>().convert(BaseComponent);
```

## LICENSE
MIT
