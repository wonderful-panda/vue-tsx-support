import Vue from "vue";
import * as tsx from "../..";

const Test = Vue.extend({
    render() {
        return <div>Test</div>;
    }
});

// No type-checks are done.

<Test />;

// OK: unknown properties are allowed
<Test foo="bar" />;

// NG: type of reserved attributes are checked
<Test ref={ 0 } />;             //// TS2322: is not assignable to type 'string'
<Test staticClass={ 1 } />;     //// TS2322: is not assignable to type 'string'
<Test { ...{ ref: 2 } } />;     //// TS2322: is not assignable to type 'string'

