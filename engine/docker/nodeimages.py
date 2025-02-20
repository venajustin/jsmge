import os
import shutil
import time
from importlib.metadata import pass_none

# import docker
import docker.errors
import random as r

client = docker.from_env()

# define host computer and container locations for the user's js code, will be linked with read-only privilege
host_server_js = os.getcwd() + '/applications/'
base_app_start = os.getcwd() + '/app-start/'
container_server_js = '/usrcode/'

def new_app():
    maxid = 0
    for app in get_apps():
        try:
            if int(app['id']) > maxid:
                maxid = int(app['id'])
        except:
            print("invalid appid", app['id'])
    setup_app_dir(maxid + 1)
    start_node(maxid + 1)

def get_apps():
    apps = []
    for file in os.listdir(host_server_js):
        try:
            container = client.containers.get("server-output-" + file.title())
            status = container.status
        except docker.errors.NotFound:
            status = "no_container"
        app = {
            'id': file.title(),
            'status': status
        }
        apps.append(app)
    return apps

def delete_app(id):
    for app in get_apps():
        if id == app['id']:
            if app['status'] != 'nocontainer':
                # we need to delete the container first
                container = client.containers.get("server-output-" + str(id))
                cleanup_node(container)
    shutil.rmtree(host_server_js + str(id))
    #os.rmdir(host_server_js + str(id))


def refresh_container(id):
    try:
        container = client.containers.get("server-output-" + str(id))
        try:
            container.restart()
            return True
        except docker.errors.APIError:
            return False
    except docker.errors.NotFound:
        start_node(id)

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


def setup_app_dir(id):
   # os.mkdir(host_server_js + str(id))

    shutil.copytree(base_app_start, host_server_js + str(id))

    # for file in os.listdir(base_app_start):
    #     shutil.copyfile(base_app_start + "/" + file, host_server_js + str(id) + "/" + file)

def start_node(id):
    # defines the mounting of server backend code

    volumes = {
        host_server_js + str(id): {'bind':container_server_js, 'mode': 'ro'}
    }

    name = 'server-output-' + str(id)

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