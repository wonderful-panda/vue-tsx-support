import Vue from "vue";
import * as tsx from "../..";

// OK: known element
const a = <div id="test" accesskey="test" />;
const b = <div id="test" onClick={ e => console.log(e.target) } />;
const c = <div id="test" onKeydown={ e => console.log(e.keyCode) } />;

// NG; type mismatch
const d = <div id={ 1 } />;   /// TS2322: is not assignable to type 'string'
const e = <div id="test" onClick={ (e: KeyboardEvent) => console.log(e.keyCode) } />;   /// TS2322: 'MouseEvent' is not assignable to type 'KeyboardEvent'

// OK: unknown element is accetptable
<foo />;
