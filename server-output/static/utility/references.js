
export function decorate(target, overrides = {}) {
    return new Proxy(target, {
        get(obj, prop, receiver) {
            if (prop in overrides) {
                const fn = overrides[prop];
                return typeof fn === 'function' ? fn.bind(receiver) : fn;
            }

            // wrap all existing function calls
            const original = Reflect.get(obj, prop, receiver);
            if (typeof Reflect.get(obj, prop, receiver) === 'function') {
                return function (...args) {
                    obj._pending_functions.push({name: prop, parameters: args});
                    return original.apply(this, args);
                }
            }

            return original;
        }
    });
}

export function create_reference(object) {
    return decorate(object, {
        toJSON() {
            return {
                _ref: this._id
            }
        }
    })
}
