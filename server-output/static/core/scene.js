import {collide} from "#static/core/collision-shapes/collision-shape.js";
import { create_reference } from '#static/utility/references.js';

import * as math from "mathjs";

class Scene {
    _objects = [];

    players_max = 0;

    constructor(srcObj) {
        srcObj && Object.assign(this,srcObj);
    }

    _draw(p) {
        p.clear()
        this._objects.forEach((o) => {
            o._draw(p);
        });
    }  
    _draw_editor(p) {
        this._objects.forEach((o) => {
            o._draw_editor(p);
        });
    }

    _addObject(obj) {
        this._objects.push(obj);
    }

    _edit_drag_intersect(point, editState) {
        editState.mat = math.identity(3,3);
        let output = [];
        this._objects.forEach((o) => {
           output.push(...o._edit_drag_intersect(point, editState));
        });
        return output;
    }
    async _setup() {

        this._s_index = new Map();

        for (const o of this._objects) {
            await o._setup(this);
        }
    }
    // like setup but with p5 context
    // for loading images to p5
    async _load(p) {
        for (const o of this._objects) {
           await o._load(p);
        }
    }

    _update(dtime, inputs) {
        this._objects.forEach((o) => {
            o._update(dtime, inputs);
        });
    }
    _test_collisions(curr_matrix) {

        let colliders = [];
        for (const obj of this._objects) {
            colliders.push(...obj._get_colliders(curr_matrix)); // TODO: make independant of p5, probably pass matrix rather than p context
        }
        // console.log("Colliders:");
        // console.log(colliders);
        // for (const col of colliders) {
        //     console.log(col.collider._shape.get_axis()) ;
        // }

        // TODO: use octree
        for (const col1 of colliders) {
            for (const col2 of colliders) {
                if (col1 !== col2) {
                    if (collide(col1.collider._shape, col2.collider._shape)) {
                        col1.collider._parent._collision(col2.collider._parent);
                        // console.log("collision");
                    }
                }
            }
        }
    }

    _process_server_updates(update_list, owner = -1) {
        for (const update of update_list) {
            for (const obj of update.objlist) {
                if (obj != null) {
                    const target = this._s_index.get(obj._id);
                    if (obj._owner === undefined || obj._owner !== owner) {
                        Object.assign(target, obj); // copies all data from obj into target and overwrites same-named members

                        for (const prop in target) {
                            if (typeof target[prop] === "object" && target[prop].hasOwnProperty("_ref")) {
                                target[prop] = create_reference(this._s_index.get(target[prop]._ref));
                            }
                        }
                    }
                }
            }
        }
    }

    _get_function_calls() {
        const members = this._get_sync_members_synchronous();
        let output = [];
        for (const member of members) {
            if (member.hasOwnProperty("_pending_functions") && member._pending_functions.length > 0) {
                for (const fn of member._pending_functions) {
                    output.push({
                        id: member._id,
                        function: fn
                    });
                }
                member._pending_functions.length = 0;
            }
        }
        return output;
    }


    // Gets all objects in the scene, but only their members that are 
    // synced between clients & server
    //
    // Confusing naming i know but I really can't come up with a better
    // name than sync. This is also a synchronous version of what should
    // probably be an async method so i tacked the word synchronous to the 
    // end to differentiate it from the future _get_sync_members() func
    // that we will probably want
    _get_sync_members_synchronous() {
        let list = [];
        for (const obj of this._objects) {
            list.push(...obj._get_sync_members())
        }
        return list;
    }
    _get_client_owned_members_synchronous(playerid) {
        let list = [];
        for (const obj of this._objects) {
            list.push(...obj._get_owned_members(playerid));
        }
        return list;
    }
    _update_from_clients(clientmap) {
//         for (const update_list of clientmap) {
//             if (update_list.playerid !== undefined) {
//                 for (const obj of update_list) {
//                     const target = this._s_index.get(obj._id);
//                     Object.assign(target, obj); // copies all data from obj into target and overwrites same-named members
//                 }
//             }
//         }
        //console.log(clientmap);
        for (const obj of this._objects) {
            obj._update_from_clients(clientmap);
        }
    }
    _call_remote_functions(function_calls) {
//         for (const update_list of clientmap) {
//             if (update_list.playerid !== undefined) {
//                 for (const obj of update_list) {
//                     const target = this._s_index.get(obj._id);
//                     Object.assign(target, obj); // copies all data from obj into target and overwrites same-named members
//                 }
//             }
//         }
        //console.log(clientmap);

        for (const call of function_calls) {
            const target = this._s_index.get(call.id);
            const fn = Reflect.get(target, call.function); // TODO: add parameters
            fn.bind(target)();/// calls the function with the correct scope
        }

        function_calls.length = 0;
    }

}


export { Scene } ;

