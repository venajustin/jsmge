let sources = [];

export async function getClassList() {

    // TODO: programatically find all modules
    sources = [
        '#static/core/scene.js',
        '#static/core/frame/frame.js',
        '#static/core/frame/animated-sprite.js',
        '#static/core/frame/collider.js',
        '#static/core/collision-shapes/collision-sphere.js'
    ];

    let classes = [];
    let promises = [];
    sources.forEach((source) => {
        promises.push(import(source).then((sourceExports) => {
            classes.push(getExportedClasses(sourceExports));
        }));
    });

    await Promise.all(promises);
    return classes;

}

function getExportedClasses(module) {

    return Object.entries(module)
        .filter(([_, value]) => typeof value === "function" && /^class\s/.test(value.toString()))
        .map(([name]) => name);

}
