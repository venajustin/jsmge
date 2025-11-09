
export function decorate(target, overrides = {}) {
    return new Proxy(target, {
        get(obj, prop, receiver) {
            if (prop in overrides) {
                const fn = overrides[prop];
                return typeof fn === 'function' ? fn.bind(receiver) : fn;
            }

            // wrap all existing function calls
            if (typeof Reflect.get(obj, prop, receiver) === 'function') {
                obj._pending_functions.push(prop);
            }

            return Reflect.get(obj, prop, receiver);
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
