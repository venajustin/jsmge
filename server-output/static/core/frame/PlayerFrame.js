import {Frame} from "#static/core/frame/frame.js";


export class PlayerFrame extends Frame {


//     _load(p) {
//         super._load(p);
//
//         this._owner = p.playerid;
//     }

    _update(dtime, input) {
        for (const player_input of input) {
            if (player_input.playerid === this._owner) {
                this.handle_input(player_input.inputs)
            }
        }
        super._update(dtime, input);
    }

    _update_from_clients(clientmap) {
       super._update_from_clients(clientmap);
       if (clientmap.has(this._owner)) {
            const list = clientmap.get(this._owner);
            for (const obj of list) {
                if (obj._id === this._id) {
                    Object.assign(this, obj);
                }
            }
       }

    }
    _get_owned_members(playerid) {
        let list = [];
        if (this._owner === playerid) {
            let output = {};
            for (const property in this) {
                if (Frame.excluded_members.indexOf(property) === -1) {
                    output[property] = this[property];
                }
            }
            list.push(output);
        }
        for (const  child of this._children) {
            list.push(...child._get_owned_members(playerid));
        }
        return list;

    }
}