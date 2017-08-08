import Vue from "vue";
import * as tsx from "../..";

const Test = tsx.createComponent<{ name: string, value?: string }, { onOk: void }>({
    name: "Test",
    props: { name: { type: String, required: true }, value: String },
    render() {
        return <div class={ this.name } onClick={ this.$emit("ok") }>{ this.value }</div>;
    }
});

/*
 * Success expected
 */
<Test name="foo" />;

<Test name="foo" value="bar" />;

<Test name="foo" onOk={ () => console.log("ok") } />;

<Test { ...{ props: {} } }  />;

<Test { ...{ props: { name: "foo" } } }  />;

<Test name="foo" nativeOnClick={ e => console.log(e.target) } />;

/*
 * Failure expected
 */
// unknown prop
<Test name="foo" unknown="bar" />;  //// TS2339: Property 'unknown' does not exist

// type mismatch of known prop
<Test name={ 1 } />; //// TS2322: '1' is not assignable to type 'string'

// type mismatch of known optional prop
<Test name="foo" value={ 1 } />;  //// TS2322: '1' is not assignable to type 'string'

// type mismatch of event
<Test name="foo" onOk={ (arg: string) => console.log(arg) } />; //// TS2322: Type 'void' is not assignable to type 'string'

// type mismatch of props in JSX spread
<Test { ...{ props: { foo: "foo" } } } />; //// TS2322

