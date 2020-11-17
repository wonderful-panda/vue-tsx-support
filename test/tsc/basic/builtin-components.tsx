<transition />;

<transition name="foo" />;

<transition onEnter={(_, done) => done()} />;

// @ts-expect-error: '(1|number)' is not assignable
<transition name={1} />;

<transition-group />;

<transition-group name="foo" />;

<transition-group onEnter={(_, done) => done()} />;

// @ts-expect-error: '(1|number)' is not assignable
<transition-group name={1} />;

<keep-alive />;

<keep-alive include="foo" />;

<keep-alive include={/foo/} />;

<keep-alive include={["foo", /foo/]} />;

// @ts-expect-error: 'number' is not assignable
<keep-alive include={["foo", /foo/, 1]} />;
