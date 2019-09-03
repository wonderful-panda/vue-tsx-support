import Vue, { VNode } from "vue";
import * as vuetsx from "vue-tsx-support";
import component from "vue-class-component";

const noop = () => {};

function basicFunctionary() {
    const factory = vuetsx.componentFactory.mixin({
        props: { foo: String },
        computed: {
            fooUpper(): string {
                return this.foo.toUpperCase();
            }
        }
    }).mixin(vuetsx.component({
        props: { bar: String },
        computed: {
            barUpper(): string {
                return this.bar.toUpperCase();
            }
        }
     }, ["bar"])
    ).mixin(Vue.extend({
        data() {
            return { baz: "piyo" }
        }
    }));

    const Component = factory.create({
        props: { bra: Number },
        render(): VNode {
            return <div>{ this.fooUpper + this.barUpper + this.baz }</div>
        }
    });

    <Component foo="foo" bar="bar" bra={1} />;
    <Component foo="foo" bra={1} />; //// TS2322 | TS2326 | TS2769: Property 'bar' is missing
}

