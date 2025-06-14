import os

import docker
import docker.errors

import engine.docker.nodeimages
from engine.docker.nodeimages import new_app, cleanup_node

try:
    client = docker.from_env()
except:
    print("ERROR getting docker environtment. Ensure docker is installed and running.")
    exit()

container_src_dir = os.getcwd() + '/server-output/'
nginx_src_dir = os.getcwd() + '/nginx-config/'
editor_src_dir = os.getcwd() + '/editor'


def create_node_image():
    image = client.images.build(path=container_src_dir, tag="server-img", rm=True)
    return image

def create_nginx_image():
    image = client.images.build(path=nginx_src_dir, tag="nginx-router-img", rm=True)
    return image

def create_editor_image():
    image = client.images.build(path=editor_src_dir, tag="editor-img", rm=True)
    return image

def start_nginx():

    ports = {
        '80/tcp': 80
    }


    container = client.containers.run(
        image='nginx-router-img',
        detach=True,
        ports=ports,
        network='user-apps',
        name='routing-server',
    )
    print(f"Container '{container.name}' started.")
    return container

def start_editor():
    ports = {
        '5173/tcp' : 5173
    }

    container = client.containers.run(
        image='editor-img',
        detach=True,
        ports=ports,
        network='user-apps',
        name='editor-container'
    )
    print(f"Editor container '{container.name}' started.")
    return container


def start_network():
    return client.networks.create(name="user-apps", driver="bridge")
def stop_network():
    networks = client.networks.list(filters={'name': 'user-apps'})
    for network in networks:
        network.remove()

def clear_containers():
    print('clearing containers')
    curr_containers = client.containers.list(all=True, filters={'name': 'routing-server'})
    for curr_container in curr_containers:
        print(curr_container, "name:", curr_container.name, " exists, deleting...")
        cleanup_node(curr_container)

    try:
        curr_containers = client.containers.list(all=True, filters={'name': 'server-output'})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, "still exists, deleting...")
            cleanup_node(curr_container)
        curr_containers = client.containers.list(all=True, filters={'name': 'editor-container'})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, " exists, deleting...")
            cleanup_node(curr_container)
    except docker.errors.NotFound :
        print("no container exists, none to delete")



def setup():
    clear_containers()
    stop_network()
    network = start_network()
    create_editor_image()
    create_nginx_image()
    img = create_node_image()
    ed = start_editor()

    nx = start_nginx()







def shutdown():
    clear_containers()
    stop_network()



