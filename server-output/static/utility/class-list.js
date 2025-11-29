import { getSources } from '#static/utility/get-sources.js';

let sources = [];

export async function getClassList() {

    // TODO: programatically find all modules
    sources = await getSources();
    console.log(sources);


    let classes = [];
    let promises = [];
    sources.forEach((source) => {
        promises.push(import(source).then((sourceExports) => {
            classes.push(getExportedClasses(sourceExports));
        }));
    });

    await Promise.all(promises);

    let output = [];
    for ( let i = 0; i < classes.length; i++) {
        const class_fns = classes[i];
        for (const class_fn of class_fns) {
            output.push(class_fn);
        }
    }

    return output;

}

export function getExportedClasses(module) {

    return Object.entries(module)
        .filter(([_, value]) => typeof value === "function" && /^class\s/.test(value.toString()))
        .map(([name, class_fn]) => class_fn);

}

export function getSourcePaths() {

}
