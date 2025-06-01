import datetime
import os
import shutil
import json
import time
from importlib.metadata import pass_none

# import docker
import docker.errors
import random as r

try:
    client = docker.from_env()
except:
    print("ERROR getting docker environtment. Ensure docker is installed and running.")
    exit()

# define host computer and container locations for the user's js code, will be linked with read-only privilege
host_server_js = os.getcwd() + '/applications/'
base_app_start = os.getcwd() + '/usrcode/'
container_server_js = '/usrcode/'

def new_app():
    maxid = 0
    for app in get_apps():
        try:
            if int(app['id']) > maxid:
                maxid = int(app['id'])
        except:
            print("invalid appid", app['id'])
    app = setup_app_dir(maxid + 1)
    app["status"] = start_node(maxid + 1).status
    return app

def get_apps():
    apps = []
    for file in os.listdir(host_server_js):

        # Check if container is running
        try:
            container = client.containers.get("server-output-" + file.title())
            status = container.status
        except docker.errors.NotFound:
            status = "no_container"

        name = "err"
        creation_date = "err"

        # read app info from json file
        for content in os.listdir(host_server_js + file):
            if content == "info.json":
                with open(host_server_js + file + "/" + content, 'r') as info_file:
                    info_dict = json.loads(info_file.read())
                    name = info_dict["name"]
                    creation_date = info_dict["creation_date"]

        app = {
            'name': name,
            'creation_date': creation_date,
            'id': file.title(),
            'status': status
        }
        apps.append(app)
    return apps

def delete_app(app_id):
    for app in get_apps():
        if app_id == app['id']:
            if app['status'] != 'no_container':
                # we need to delete the container first
                container = client.containers.get("server-output-" + str(app_id))
                cleanup_node(container)
    shutil.rmtree(host_server_js + str(app_id))
    #os.rmdir(host_server_js + str(app_id))


def refresh_container(app_id):
    try:
        container = client.containers.get("server-output-" + str(app_id))
        try:
            container.restart()
            return True
        except docker.errors.APIError:
            return False
    except docker.errors.NotFound:
        start_node(app_id)

def stop_container(app_id):
    container = client.containers.get("server-output-" + str(app_id))
    cleanup_node(container)

def cleanup_node(container):
    print("cleanup container", container.name)
    try:
        container.kill()
        print("container stopped, removing...")
    except docker.errors.APIError:
        print("container already stopped, removing...")
    finally:
        container.remove()
        print("container removed")


def setup_app_dir(app_id):
   # os.mkdir(host_server_js + str(app_id))

    shutil.copytree(base_app_start, host_server_js + str(app_id))

    # for file in os.listdir(base_app_start):
    #     shutil.copyfile(base_app_start + "/" + file, host_server_js + str(app_id) + "/" + file)

    with open(host_server_js + str(app_id) + "/" + "info.json", 'w') as info_file:
        starting_info = {
            "name": "App-" + str(app_id),
            "creation_date": datetime.datetime.now().strftime("%m-%d-%Y")
        }
        info_file.write(json.dumps(starting_info))

    return {
       'name': starting_info["name"],
       'creation_date': starting_info["creation_date"],
       'id': app_id,
       'status': ""
    }

def start_node(app_id):
    # defines the mounting of server backend code

    volumes = {
        host_server_js + str(app_id): {'bind':container_server_js, 'mode': 'ro'}
    }

    name = 'server-output-' + str(app_id)

    container = client.containers.run(
        image='server-img:latest',
        detach=True,
        volumes=volumes,
        # ports=ports, <-- no ports anymore because nginx manages connections to node containers
        name = name,
        # name='server-output',
        network='user-apps'
    )
    print(f"Container '{container.name}' started with volume mounted.")
    return container


def reset_container(id):
    shutil.rmtree(host_server_js + str(id))

    shutil.copytree(base_app_start, host_server_js + str(id))

    # for file in os.listdir(base_app_start):
    #     shutil.copyfile(base_app_start + "/" + file, host_server_js + str(app_id) + "/" + file)

    with open(host_server_js + str(id) + "/" + "info.json", 'w') as info_file:
        starting_info = {
            "name": "App-" + str(id),
            "creation_date": datetime.datetime.now().strftime("%m-%d-%Y")
        }
        info_file.write(json.dumps(starting_info))

    return refresh_container(id)
