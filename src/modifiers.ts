export type EventFilter = (event: Event) => boolean;
export type EventHandler<E extends Event> = (event: E) => void;

export type KeyModifierName = "esc" | "tab" | "enter" | "space" | "up" | "down" | "del";
export type ModKeyModifierName = "ctrl" | "noctrl" | "shift" | "noshift" | "alt" | "noalt" | "meta" | "nometa";
export type StandaloneModifierName = "left" | "right" | "middle" | "prevent" | "stop" | "self";
export type ModifierName = KeyModifierName | ModKeyModifierName | StandaloneModifierName;

export type ExcludedKeys = { [K in StandaloneModifierName]: K } & {
    ctrl: "ctrl" | "noctrl";
    shift: "shift" | "noshift";
    alt: "alt" | "noalt";
    meta: "meta" | "nometa";
    noctrl: "ctrl" | "noctrl";
    noshift: "shift" | "noshift";
    noalt: "alt" | "noalt";
    nometa: "meta" | "nometa";
} & { [K in KeyModifierName]: KeyModifierName };

const keyCodes: { [K in KeyModifierName]: number[] } = {
    esc: [27],
    tab: [9],
    enter: [13],
    space: [32],
    up: [38],
    down: [40],
    del: [8, 46]
};

export type Modifiers<Keys extends ModifierName> = { [K in Keys]: Modifier<Exclude<Keys, ExcludedKeys[K]>> };

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

function createKeyFilter(keys: (KeyModifierName | number)[]): EventFilter {
    const codes = [] as number[];
    for (const key of keys) {
        if (typeof key === "number") {
            codes.push(key);
        } else {
            codes.push(...keyCodes[key]);
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
    name: ModifierName,
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
            const keyName = name as KeyModifierName;
            defineChildModifier(m, filters, keyName, createKeyFilter([keyName]), false);
        }
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
    self
} = root;
