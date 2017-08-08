import Vue from "vue";
import * as tsx from "../..";

interface Props {
    name: string;
    value?: string;
}
interface Events {
    onInput: string;
}

const Test = tsx.of<Props, Events>().convert(
    Vue.extend({
        name: "Test",
        props: { name: String, value: String },
        render() {
            return <div>Test</div>;
        }
    })
);

/**
 * Will success
 */
<Test name="foo" />;

<Test name="foo" value="bar" />;

<Test name="foo" onInput={ val => console.log(val) } />;

<Test name="foo" nativeOnKeydown={ e => console.log(e.keyCode) } />;

/**
 * Will fail
 */
<Test />;                           //// TS2322: Property 'name' is missing

<Test name={ 1 } />;                //// TS2322: Type '1' is not assignable

<Test name="foo" value={ 2 } />;    //// TS2322: Type '2' is not assignable

<Test name="foo" onInput={ (val: number) => console.log(val) } />;  //// TS2322: Type 'string' is not assignable to type 'number'

<Test name="foo" nativeOnKeypress={ (e: MouseEvent) => console.log(e.x) } />;  //// TS2322: Type 'KeyboardEvent' is not assignable to type 'MouseEvent'

