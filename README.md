# vue-tsx-support
TSX (JSX for TypeScript) support library for Vue

**EXPERIMENTAL**

## Usage

After this library imported, only Components with attributes `_tsxattrs` can be used in JSX syntax.

Here are some ways to make your components working.

### Standard component

If you use `Vue.extend()` to write component, just use `createCompnent` instead of `Vue.extend`.

```typescript
import Vue from "vue";
import * as tsx from "vue-tsx-support";

const MyComponent = tsx.createComponent({
    template: "<span>Hello</span>"
});
```

And you can use it in JSX syntax, but no attributes are checked statically yet.

```jsx
// MyComponent has not props 'foo' nor 'bar', but this code does not cause compilation error.
<MyComponent foo="a" bar={ 1 } />
```

If your component has props, you can declare it by type parameter

```typescript
import Vue from "vue";
import * as tsx from "vue-tsx-support";

interface Props {
    text: string;           // required prop
    important?: boolean;    // opitonal prop
}

const MyComponent = tsx.createComponent<Props>({
    props: {
        text: { type: String, required: true },
        important: Boolean
    },
    template: "<span :class='className'>{{ text }}</span>",
    computed: {
        className() {
            return this.important ? "label-important" : "label-normal";
        }
    }
});
```

If your component also has own events, you can declare it by second type parameter

```typescript
import Vue from "vue";
import * as tsx from "vue-tsx-support";

interface Props {
    text: string;           // required prop
    important?: boolean;    // opitonal prop
}
interface Events {
    // member name : event name prefixed by 'on'
    // member type : event parameter type
    onOk: MouseEvent;
    onCancel: MouseEvent;
}

const MyComponent2 = tsx.createComponent<Props, Events>({
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

Now, TypeScript compiler knows what props your component have.

```jsx
// OK
<MyComponent text="Hello" />;
<MyComponent text="Hello" important={ true } />;
<MyComponent2 text="Hello" onOk={ () => console.log("ok") } onCancel={ () => console.log("cancel") } />;

// OK: Some attributes are available by default. e.g. 'id', 'class', 'ref', ...
<MyComponent text="Hello" id="my-id" class="header-item" />;

// OK: native dom event handlers can be specified, too
<MyComponent text="Hello" nativeOnClick={ () => console.log("clicked") } />;

// ERROR: required prop 'text' is not specified
<MyComponent />;

// ERROR: type of 'text' is not string
<MyComponent text={ 1 }/>;

// ERROR: 'unknownProp' is not prop of MyComponent
<MyComponent text={ 1 } unknownProp={ 0 }/>;

// ERROR: argument type of `onOk` handler is not MouseEvent
<MyComponent2 text="Hello" onOk={ (e: KeyboardEvent) => console.log(e.keyCode) } />;
```

### Using with vue-class-component

If you use `vue-class-component`, use `tsx.Component` instead of `Vue` as a super class

```typescript
import Vue from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

interface Props = { text: string };
interface Events = { onOk: string };
@Component({
    props: { text: String },
    template: `<span @click="onClick">{{ text }}</span>`,
})
class MyComponent extends tsx.Component<Props, Events> {
    onClick() {
        this.$emit("ok", "clicked!");
    }
}
```

Or, add `_tsxattrs` field to your component.

```typescript
@Component({
    props: { text: String },
    template: `<span @click="onClick">{{ text }}</span>`,
})
class MyComponent extends Vue {
    _tsxattrs: tsx.TsxCompnentAttrs<Props, Events>;

    onClick() {
        this.$emit("ok", "clicked!");
    }
}
```

### Make 3rd-party components working

If you want to use component provided by 3rd-party libraries, you can make it working by `tsx.convert`

```typescript
import Vue from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

import { SomeComponent as SomeComponent_ } from "third-party-library";

const SomeComponent = tsx.convert(SomeCompnent_);
```

You can specify type parameters by `tsx.of` like below

```typescript
interface Props = { text: string };
interface Events = { onOk: string };
const SomeComponent = tsx.of<Props, Events>().convert(SomeCompnent_);
```

## LICENSE
MIT
