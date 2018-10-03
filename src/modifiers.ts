export type EventFilter = (event: Event) => boolean;
export type EventHandler<E extends Event> = (event: E) => void;

export type KeyModifierName = "esc" | "tab" | "enter" | "space" | "up" | "down" | "del";
export type ModKeyModifierName = "ctrl" | "noctrl" | "shift" | "noshift" | "alt" | "noalt" | "meta" | "nometa";
export type StandaloneModifierName = "left" | "right" | "middle" | "prevent" | "stop" | "self";
export type ModifierName = KeyModifierName | ModKeyModifierName | StandaloneModifierName | "keys";

export type ExcludedKeys = { [K in StandaloneModifierName]: K } & {
    ctrl: "ctrl" | "noctrl";
    shift: "shift" | "noshift";
    alt: "alt" | "noalt";
    meta: "meta" | "nometa";
    noctrl: "ctrl" | "noctrl";
    noshift: "shift" | "noshift";
    noalt: "alt" | "noalt";
    nometa: "meta" | "nometa";
} & { [K in KeyModifierName]: KeyModifierName | "keys" } & { keys: KeyModifierName | "keys" };

const keyCodes: { [K in KeyModifierName | "left" | "right"]: number | [number, number] } = {
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

export type Modifiers<Keys extends ModifierName> = {
    [K in Keys]: K extends "keys"
        ? (...keys: (KeyModifierName | "left" | "right" | number)[]) => Modifier<Exclude<Keys, ExcludedKeys[K]>>
        : Modifier<Exclude<Keys, ExcludedKeys[K]>>
};

export type Modifier<Keys extends ModifierName> = Modifiers<Keys> & {
    <E extends Event>(handler: EventHandler<E>): EventHandler<E>;
    (event: Event): void; // Modifier itself can behave as EventHandler
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

function createKeyFilter(keys: (KeyModifierName | "left" | "right" | number)[]): EventFilter {
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

function defineChildModifier(
    target: Function,
    currentFilters: EventFilter[],
    name: string,
    filter: EventFilter,
    includeKeyModifiers: boolean
) {
    Object.defineProperty(target, name, {
        get: function() {
            // call this getter at most once.
            // reuse created instance after next time.
            const ret = createModifier([...currentFilters, filter], includeKeyModifiers);
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

function createModifier(filters: EventFilter[], includeKeyModifiers: boolean): Modifier<ModifierName> {
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
    if (includeKeyModifiers) {
        for (const name in keyCodes) {
            const keyName = name as KeyModifierName | "left" | "right";
            if (keyName === "left" || keyName === "right") {
                continue;
            }
            const code = keyCodes[keyName];
            if (typeof code === "number") {
                defineChildModifier(m, filters, keyName, (e: any) => e.keyCode === code, false);
            } else {
                const [c1, c2] = code;
                defineChildModifier(m, filters, keyName, (e: any) => e.keyCode === c1 || e.keyCode === c2, false);
            }
        }
        Object.defineProperty(m, "keys", {
            get() {
                const keysFunction = (...args: (KeyModifierName | "left" | "right" | number)[]) => {
                    const propName = "keys:" + args.toString();
                    const modifier = this[propName];
                    if (modifier !== undefined) {
                        return modifier;
                    }
                    const filter = createKeyFilter(args);
                    defineChildModifier(this, filters, propName, filter, false);
                    return this[propName];
                };
                Object.defineProperty(this, "keys", { value: keysFunction, enumerable: true });
                return keysFunction;
            },
            enumerable: true,
            configurable: true
        });
    }
    defineChildModifier(m, filters, "left", (e: any) => e.keyCode === 37 || e.button === 0, includeKeyModifiers);
    defineChildModifier(m, filters, "right", (e: any) => e.keyCode === 39 || e.button === 2, includeKeyModifiers);
    defineChildModifier(m, filters, "middle", (e: any) => e.button === 1, includeKeyModifiers);

    defineChildModifier(m, filters, "ctrl", (e: any) => e.ctrlKey, includeKeyModifiers);
    defineChildModifier(m, filters, "shift", (e: any) => e.shiftKey, includeKeyModifiers);
    defineChildModifier(m, filters, "alt", (e: any) => e.altKey, includeKeyModifiers);
    defineChildModifier(m, filters, "meta", (e: any) => e.metaKey, includeKeyModifiers);

    defineChildModifier(m, filters, "noctrl", (e: any) => e.ctrlKey !== undefined && !e.ctrlKey, includeKeyModifiers);
    defineChildModifier(
        m,
        filters,
        "noshift",
        (e: any) => e.shiftKey !== undefined && !e.shiftKey,
        includeKeyModifiers
    );
    defineChildModifier(m, filters, "noalt", (e: any) => e.altKey !== undefined && !e.altKey, includeKeyModifiers);
    defineChildModifier(m, filters, "nometa", (e: any) => e.metaKey !== undefined && !e.metaKey, includeKeyModifiers);

    defineChildModifier(m, filters, "stop", e => e.stopPropagation() || true, includeKeyModifiers);
    defineChildModifier(m, filters, "prevent", e => e.preventDefault() || true, includeKeyModifiers);
    defineChildModifier(m, filters, "self", e => e.target === e.currentTarget, includeKeyModifiers);
    return m as Modifier<ModifierName>;
}

const root = createModifier([], true);
export const {
    esc,
    tab,
    enter,
    space,
    up,
    down,
    del,
    left,
    right,
    middle,
    ctrl,
    shift,
    alt,
    meta,
    noctrl,
    noshift,
    noalt,
    nometa,
    stop,
    prevent,
    self,
    keys
} = root;
