import fs from "node:fs";
import { promisify } from 'node:util';
import { resolve, relative, join, sep, posix } from 'node:path';
import dotenv from 'dotenv'

// fanyc features for the dir reading
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export function debug_set_env() {
    if (process.env.IS_DOCKER_CONTAINER !== "true") {
        console.log("Server is NOT in a docker container, setting environment variables")
        dotenv.config({path: '../.env'});

    } else {
        console.log("Server running in docker container")
    }
}


export async function get_source_paths(user_dir) {
    
    // three primary sources, /static/core/, testuser/frames and testuser/scenes
    
    // static/core
    const corepath = resolve("./static/core");
    const userframepath = resolve(user_dir, "frames");
    const userscenepath = resolve(user_dir, "scenes");

    const corefiles =  await getRelative(corepath, "#static/core/");
    const userframefiles =  await getRelative(userframepath, "#files/frames/");
    const userscenefiles =  await getRelative(userscenepath, "#files/scenes/");

    let paths = corefiles.concat(userframefiles,userscenefiles);

    return paths;
}

async function getRelative(dir, new_name) {
    if (new_name == undefined) {
        new_name = "";
    }
    const files = (await getFiles(dir)).filter((file) => {
        const strpath = file.toString();
        if (strpath.indexOf('.js') === strpath.length - 3) {
            return true;
            
        }

        return false;
    });
    return  await Promise.all(files.map(async (file) => {
        const rel_path = join(new_name, relative(dir, file));
        return rel_path.replaceAll(sep, posix.sep);
    }));

}


async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

