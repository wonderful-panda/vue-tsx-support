# vue-tsx-support
TSX (JSX for TypeScript) support library for Vue

**EXPERIMENTAL**

## Usage

### Standard component

```typescript
import Vue from "vue";
import * as tsx from "vue-tsx-support";

// Use createComponent instead of Vue.extend to create tsx-ready component
const Greet = tsx.createComponent({
    name: "Greet",
    template: "<span>Hello</span>"
});

// If your component has props, specify them as a type parameter
interface Props { text: string; important?: boolean }
const Greet2 = tsx.createComponent<Props>({
    name: "Greet2",
    props: { text: String, important: Boolean },
    template: `
        <span :class="this.important ? 'label-important' : 'label-normal'">
            {{ text }}
        </span>`
});

// And if your component has own events, specify them as a second type parameter
interface Events { onOk: string; onCancel: string; } // member names must be prefixed by 'on'
const Greet3 = tsx.createComponent<{}, Events>({
    name: "Greet3",
    template: `
        <button @click="$emit('ok', 'OK clicked!')">OK</button>
        <button @click="$emit('cancel', 'CANCEL clicked!')">CANCEL</button>
});

// Now, TypeScript compiler knows what attributes each components have.

// OK
<Greet />;
// OK: attributes are not checked when no type parameters specified
<Greet text="foo" />;

// OK
<Greet2 text="foo" />;
// OK
<Greet2 text="foo" important={ true } />;
// OK
<Greet2 text="foo" nativeOnClick={ e => console.log(e.target) } />;
// OK: Some reserved attributes are available by default
<Greet2 ref="greet" id="greet" class="header-large" text="foo" />;
// NG: `text` is required
<Greet2 />;
// NG: `text` must be string
<Greet2 text={ 1 } />;


// OK
<Greet3 text="foo" onOk={ val => console.log(val) } />;
// NG: argument of onOk handler must be string
<Greet3 text="foo" onOk={ (val: number) => console.log(val) } />;
```

### Using `vue-class-component`

```typescript
import Vue from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

// Extend from tsx.Component instead of Vue to create tsx-ready component by vue-class-component
interface Props = { text: string };
interface Events = { onOk: string };
@Component({
    props: { text: String },
    template: `<span @click="onClick">{{ text }}</span>`,
})
class Greet extends tsx.Component<Props, Events> {
    onClick() {
        this.$emit("ok", "clicked!");
    }
}

// Or just add `_tsxattrs` field by yourself
@Component({
    props: { text: String },
    template: `<span @click="onClick">{{ text }}</span>`,
})
class Greet2 extends Vue {
    _tsxattrs: tsx.TsxCompnentAttrs<Props, Events>;

    onClick() {
        this.$emit("ok", "clicked!");
    }
}
```

### Add types to existing components
```typescript
import Vue from "vue";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

// If you want to use 3rd-party component, you can make it tsx-ready by `convert`

import { Greet as Greet_ } from "greet-component";
const UntypedGreet = tsx.convert(Greet_);  // Without type information. any attributes are acceptable.

// If you want to specify types, use `of`, and then `convert`.
interface Props { text: string; important?: boolean }
interface Events { onOk: string; onCancel: string; }
const TypedGreet = tsx.of<Props, Events>().convert(Greet_);
```

## LICENSE
MIT
