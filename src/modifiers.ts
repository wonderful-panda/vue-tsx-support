export type EventFilter = (event: Event) => boolean;
export type EventHandler<E extends Event> = (event: E) => void;

export type ModifierName =
    "esc" | "tab" | "enter" | "space" | "up" | "down" | "del" | "left" | "right" | "middle" |
    "ctrl" | "shift" | "alt" | "meta" | "noctrl" | "noshift" | "noalt" | "nometa" |
    "prevent" | "stop" | "self";

export type Modifiers = {
    [K in ModifierName]: Modifier;
}

export interface Modifier extends Modifiers {
    <E extends Event>(handler: EventHandler<E>): EventHandler<E>;
    (event: Event): void;       // Modifier itself can behave as EventHandler
}

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

function defineChildModifier(target: Function, currentFilters: EventFilter[], name: ModifierName, filter: EventFilter) {
    Object.defineProperty(target, name, {
        get: function() {
            // call this getter at most once.
            // reuse created instance after next time.
            const ret = createModifier([...currentFilters, filter]);
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

function createModifier(filters: EventFilter[]): Modifier {
    function m(arg: any): any {
        if (arg instanceof Function) {
            // EventHandler => EventHandler
            return (event: Event) => handleEvent(event, filters, arg);
        }
        else {
            // Event => void
            handleEvent(arg, filters);
            return;
        }
    }
    defineChildModifier(m, filters, "esc", (e: any) => e.keyCode === 27);
    defineChildModifier(m, filters, "tab", (e: any) => e.keyCode === 9);
    defineChildModifier(m, filters, "enter", (e: any) => e.keyCode === 13);
    defineChildModifier(m, filters, "space", (e: any) => e.keyCode === 32);
    defineChildModifier(m, filters, "up", (e: any) => e.keyCode === 38);
    defineChildModifier(m, filters, "down", (e: any) => e.keyCode === 40);
    defineChildModifier(m, filters, "del", (e: any) => e.keyCode === 8 || e.keyCode === 46);

    defineChildModifier(m, filters, "left", (e: any) => e.keyCode === 37 || e.button === 0);
    defineChildModifier(m, filters, "right", (e: any) => e.keyCode === 39 || e.button === 2);
    defineChildModifier(m, filters, "middle", (e: any) => e.button === 1);

    defineChildModifier(m, filters, "ctrl", (e: any) => e.ctrlKey);
    defineChildModifier(m, filters, "shift", (e: any) => e.shiftKey);
    defineChildModifier(m, filters, "alt", (e: any) => e.altKey);
    defineChildModifier(m, filters, "meta", (e: any) => e.metaKey);

    defineChildModifier(m, filters, "noctrl", (e: any) => e.ctrlKey !== undefined && !e.ctrlKey);
    defineChildModifier(m, filters, "noshift", (e: any) => e.shiftKey !== undefined && !e.shiftKey);
    defineChildModifier(m, filters, "noalt", (e: any) => e.altKey !== undefined && !e.altKey);
    defineChildModifier(m, filters, "nometa", (e: any) => e.metaKey !== undefined && !e.metaKey);

    defineChildModifier(m, filters, "stop", e => e.stopPropagation() || true);
    defineChildModifier(m, filters, "prevent", e => e.preventDefault() || true);
    defineChildModifier(m, filters, "self", e => e.target === e.currentTarget);
    return m as Modifier;
}

const root = createModifier([]);
export const {
    esc, tab, enter, space, up, down, del, left, right, middle,
    ctrl, shift, alt, meta, noctrl, noshift, noalt, nometa,
    stop, prevent, self
} = root;

