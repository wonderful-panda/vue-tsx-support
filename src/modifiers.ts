export type EventFilter = (event: Event) => boolean;
export type EventHandler<E extends Event> = (event: E) => void;

export type ModKey = "ctrl" | "shift" | "alt" | "meta";

export type KeyModifierName = "esc" | "tab" | "enter" | "space" | "up" | "down" | "del" | "left" | "right";
export type MouseModifierName = "left" | "right" | "middle";
export type ModKeyModifierName = ModKey | "noctrl" | "noshift" | "noalt" | "nometa";
export type StandaloneModifierName = "prevent" | "stop" | "self";
export type ModifierName =
    | KeyModifierName
    | MouseModifierName
    | ModKeyModifierName
    | StandaloneModifierName
    | "keys"
    | "exact";

// prettier-ignore
export type NextKeys<Keys extends ModifierName, K extends ModifierName> =
      K extends KeyModifierName | MouseModifierName | "keys" ? Exclude<Keys, KeyModifierName | MouseModifierName | "keys">
    : K extends "exact" ? Exclude<Keys, ModKeyModifierName | "exact">
    : K extends "ctrl" | "noctrl" ? Exclude<Keys, "ctrl" | "noctrl" | "exact">
    : K extends "shift" | "noshift" ? Exclude<Keys, "shift" | "noshift" | "exact">
    : K extends "alt" | "noalt" ? Exclude<Keys, "alt" | "noalt" | "exact">
    : K extends "meta" | "nometa" ? Exclude<Keys, "meta" | "nometa" | "exact">
    : Exclude<Keys, K>;

// prettier-ignore
export type Modifier<Keys extends ModifierName> = {
    <E extends Event>(handler: EventHandler<E>): EventHandler<E>;
    (event: Event): void; // Modifier itself can behave as EventHandler
} & {
    [K in Keys]:
        K extends "keys" ? (...keys: (KeyModifierName | number)[]) => Modifier<NextKeys<Keys, K>>
      : K extends "exact" ? (...keys: ModKey[]) => Modifier<NextKeys<Keys, K>>
      : Modifier<NextKeys<Keys, K>>
};

function handleEvent(event: Event, filters: EventFilter[], handler?: EventHandler<Event>) {
    for (let filter of filters) {
        if (!filter(event)) {
            return;
        }
    }
    if (handler) {
        handler(event);
    }
}

const keyCodes: { [K in KeyModifierName]: number | [number, number] } = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    down: 40,
    del: [8, 46],
    left: 37,
    right: 39
};

function createKeyFilter(keys: (KeyModifierName | number)[]): EventFilter {
    const codes = [] as number[];
    for (const key of keys) {
        if (typeof key === "number") {
            codes.push(key);
        } else {
            const code = keyCodes[key];
            if (typeof code === "number") {
                codes.push(code);
            } else {
                codes.push(...code);
            }
        }
    }
    switch (codes.length) {
        case 0:
            return _ => false;
        case 1:
            const code = codes[0];
            return (e: any) => e.keyCode === code;
        default:
            return (e: any) => codes.indexOf(e.keyCode) >= 0;
    }
}

interface ChildModifierFilter {
    keyboard: boolean;
    mouse: boolean;
    modkey: boolean;
    exact: boolean;
}

function defineChildModifier(
    target: Function,
    currentFilters: EventFilter[],
    name: string,
    filter: EventFilter,
    children: ChildModifierFilter
) {
    Object.defineProperty(target, name, {
        get: function() {
            // call this getter at most once.
            // reuse created instance after next time.
            const ret = createModifier([...currentFilters, filter], children);
            Object.defineProperty(target, name, {
                value: ret,
                enumerable: true
            });
            return ret;
        },
        enumerable: true,
        configurable: true
    });
}

function defineKeyCodeModifiers(target: Function, filters: EventFilter[], children: ChildModifierFilter) {
    for (const name in keyCodes) {
        const keyName = name as KeyModifierName;
        if (keyName === "left" || keyName === "right") {
            continue;
        }
        const code = keyCodes[keyName];
        if (typeof code === "number") {
            defineChildModifier(target, filters, keyName, (e: any) => e.keyCode === code, children);
        } else {
            const [c1, c2] = code;
            defineChildModifier(target, filters, keyName, (e: any) => e.keyCode === c1 || e.keyCode === c2, children);
        }
    }
}

function defineKeys(target: Function, filters: EventFilter[], children: ChildModifierFilter) {
    Object.defineProperty(target, "keys", {
        get() {
            const keysFunction = (...args: (KeyModifierName | number)[]) => {
                const propName = "keys:" + args.toString();
                const modifier = this[propName];
                if (modifier !== undefined) {
                    return modifier;
                }
                const filter = createKeyFilter(args);
                defineChildModifier(this, filters, propName, filter, children);
                return this[propName];
            };
            Object.defineProperty(this, "keys", { value: keysFunction, enumerable: true });
            return keysFunction;
        },
        enumerable: true,
        configurable: true
    });
}

function defineExact(target: Function, filters: EventFilter[], children: ChildModifierFilter) {
    Object.defineProperty(target, "exact", {
        get() {
            const exactFunction = (...args: ModKey[]) => {
                const propName = "exact:" + args.toString();
                const modifier = this[propName];
                if (modifier !== undefined) {
                    return modifier;
                }
                const expected = { ctrl: false, shift: false, alt: false, meta: false };
                args.forEach(arg => (expected[arg] = true));
                const filter = (e: any) =>
                    !!e.ctrlKey === expected.ctrl &&
                    !!e.shiftKey === expected.shift &&
                    !!e.altKey === expected.alt &&
                    !!e.metaKey === expected.meta;
                defineChildModifier(this, filters, propName, filter, children);
                return this[propName];
            };
            Object.defineProperty(this, "exact", { value: exactFunction, enumerable: true });
            return exactFunction;
        },
        enumerable: true,
        configurable: true
    });
}

function createModifier(filters: EventFilter[], children: ChildModifierFilter): Modifier<ModifierName> {
    function m(arg: any): any {
        if (arg instanceof Function) {
            // EventHandler => EventHandler
            return (event: Event) => handleEvent(event, filters, arg);
        } else {
            // Event => void
            handleEvent(arg, filters);
            return;
        }
    }
    if (children.keyboard || children.mouse) {
        const nextChildren = { ...children, keyboard: false, mouse: false };
        if (children.keyboard) {
            defineKeyCodeModifiers(m, filters, nextChildren);
            defineKeys(m, filters, nextChildren);
        }
        if (children.mouse) {
            defineChildModifier(m, filters, "middle", (e: any) => e.button === 1, nextChildren);
        }
        defineChildModifier(m, filters, "left", (e: any) => e.keyCode === 37 || e.button === 0, nextChildren);
        defineChildModifier(m, filters, "right", (e: any) => e.keyCode === 39 || e.button === 2, nextChildren);
    }
    if (children.exact) {
        const nextChildren = { ...children, exact: false, modkey: false };
        defineExact(m, filters, nextChildren);
    }
    if (children.modkey) {
        const nextChildren = { ...children, exact: false };
        defineChildModifier(m, filters, "ctrl", (e: any) => e.ctrlKey, nextChildren);
        defineChildModifier(m, filters, "shift", (e: any) => e.shiftKey, nextChildren);
        defineChildModifier(m, filters, "alt", (e: any) => e.altKey, nextChildren);
        defineChildModifier(m, filters, "meta", (e: any) => e.metaKey, nextChildren);

        defineChildModifier(m, filters, "noctrl", (e: any) => !e.ctrlKey, nextChildren);
        defineChildModifier(m, filters, "noshift", (e: any) => !e.shiftKey, nextChildren);
        defineChildModifier(m, filters, "noalt", (e: any) => !e.altKey, nextChildren);
        defineChildModifier(m, filters, "nometa", (e: any) => !e.metaKey, nextChildren);
    }
    defineChildModifier(m, filters, "stop", e => e.stopPropagation() || true, children);
    defineChildModifier(m, filters, "prevent", e => e.preventDefault() || true, children);
    defineChildModifier(m, filters, "self", e => e.target === e.currentTarget, children);
    return m as Modifier<ModifierName>;
}

export const modifiers = createModifier([], { keyboard: true, mouse: true, modkey: true, exact: true });
