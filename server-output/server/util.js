import fs from "node:fs";
import dotenv from 'dotenv'

export function debug_set_env() {
    if (process.env.IS_DOCKER_CONTAINER !== "true") {
        console.log("Server is NOT in a docker container, setting environment variables")
        dotenv.config({path: '../.env'});

    } else {
        console.log("Server running in docker container")
    }
}

