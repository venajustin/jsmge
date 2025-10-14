
const excluded_key_names = [
        '_parent',
        '_frames',
        '_children',
        '_animated_sprites',
        '_colliders'

    ];

export function json_exclude_members(key, value) {
    if (key.toString() in excluded_key_names ) {
        return undefined;
    } else return value;
}