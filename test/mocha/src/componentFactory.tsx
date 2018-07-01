import assert from "power-assert";
import { mount } from "vue-test-utils";
import Vue, { VNode } from "vue";
import * as tsx from "../../..";

describe("componentFactory", () => {
    describe("create", () => {
        it("simple component", () => {
            const MyComponent = tsx.component({
                props: {
                    foo: String,
                    bar: { type: String, default: "barDefault" }
                },
                render(): VNode {
                    return <span>{this.foo + " " + this.bar}</span>;
                }
            }, ["foo"]);

            const w = mount(MyComponent, { propsData: { foo: "fooValue" } });
            assert(w.html() === "<span>fooValue barDefault</span>");
        });

        it("scoped slot", () => {
            const ChildComponent = tsx.componentFactoryOf<{}, { default: string }>().create({
                props: {
                    foo: String
                },
                render(): VNode {
                    return <div>{this.$scopedSlots.default(this.foo)}</div>;
                }
            });

            const ParentComponent = tsx.component({
                render(): VNode {
                    return (
                        <ChildComponent foo="fooValue" scopedSlots={{
                            default: v => [<span>{v}</span>]
                        }} />
                    );
                }
            });

            const w = mount(ParentComponent);
            assert(w.html() === "<div><span>fooValue</span></div>");

        });
    });

    describe("extendFrom", () => {
        it("accessing base component members", () => {
            const BaseComponent = tsx.component({
                props: {
                    foo: String
                },
                computed: {
                    bar() {
                        return "bar";
                    }
                }
            });

            const ExtendedComponent = tsx.extendFrom(BaseComponent).create({
                props: {
                    baz: String
                },
                render(): VNode {
                    return <span>{this.foo + this.bar + this.baz}</span>;
                }
            });

            const w = mount(ExtendedComponent, { propsData: { foo: "foo", baz: "baz" } });
            assert(w.html() === "<span>foobarbaz</span>")
        })
    });

    describe("mixin", () => {
        it("accessing mixin's member", () => {
            const Mixin = {
                props: {
                    foo: String
                },
                computed: {
                    bar() {
                        return "bar";
                    }
                }
            };

            const Component = tsx.componentFactory.mixin(Mixin).create({
                props: {
                    baz: String
                },
                render(): VNode {
                    return <span>{this.foo + this.bar + this.baz}</span>;
                }
            });

            const w = mount(Component, { propsData: { foo: "foo", baz: "baz" } });
            assert(w.html() === "<span>foobarbaz</span>")
        });
        it("multiple mixins", () => {
            const Mixin1 = {
                data() {
                    return { foo: "foo" }
                }
            };
            const Mixin2 = Vue.extend({
                data() {
                    return { bar: "bar" }
                }
            });

            const Component = tsx.componentFactory.mixin(Mixin1).mixin(Mixin2).create({
                props: {
                    baz: String
                },
                render(): VNode {
                    return <span>{this.foo + this.bar + this.baz}</span>;
                }
            });

            const w = mount(Component, { propsData: { baz: "baz" } });
            assert(w.html() === "<span>foobarbaz</span>")
        });

    });

});
