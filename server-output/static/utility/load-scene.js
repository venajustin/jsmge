
import { getClassList } from '#static/utility/class-list.js'

export async function loadScene(sceneJson) {


// for some reason, the classes have to be pulled out of their containing
// single element arrays here in this module or it wont work

    const classes = await getClassList();
    console.log("classes: " + classes);
    return window.ESSerializer.deserialize(sceneJson, classes);
    

}
