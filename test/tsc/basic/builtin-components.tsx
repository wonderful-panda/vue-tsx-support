<transition />;

<transition name="foo" />;

<transition onEnter={ (_, done) => done() } />;

<transition name={ 1 } />; //// TS2322 | TS2326: /'(1|number)' is not assignable/

<transition-group />;

<transition-group name="foo" />;

<transition-group onEnter={ (_, done) => done() } />;

<transition-group name={ 1 } />; //// TS2322 | TS2326: /'(1|number)' is not assignable/

<keep-alive />;

<keep-alive include="foo" />;

<keep-alive include={ /foo/ } />;

<keep-alive include={ ["foo", /foo/] } />;

<keep-alive include={ ["foo", /foo/, 1] } />; //// TS2322 | TS2326: 'number' is not assignable

