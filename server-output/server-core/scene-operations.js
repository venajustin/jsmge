import fs from "node:fs";
import ESSerializer from "esserializer";
import {getClassList} from "#static/utility/class-list.js";

export async function loadScene(path) {
    const text = fs.readFileSync(path);
    const classes = await getClassList();
    const s = await ESSerializer.deserialize(text, classes);
    s._setup();
    return s;
}