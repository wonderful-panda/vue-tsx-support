import Vue from "vue";
import * as tsx from "../..";

const Test = tsx.convert(
    Vue.extend({
        name: "Test",
        render() {
            return <div>Test</div>;
        }
    })
);

// No type-checks are done.

<Test />;

<Test foo="bar" />;

<Test { ...{ props: { foo: 1 } } } />;
