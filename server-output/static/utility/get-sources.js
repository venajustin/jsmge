

function isNode() {
    return typeof process !== 'undefined' &&
        !!process.versions &&
        !!process.versions.node;
}

export async function getSources() {
    if (isNode()) {
        // we just import and use the local findPaths function
        const mod = await import('../../server/util.js');
        return await mod.get_source_paths('./testUsr');
        
    } else {
        // we call the endpoint to get all paths
        const res = await fetch('/get-source-paths/');
        return (await res.json()).paths;
    }
    

}

