import os

import docker
import docker.errors

import engine.docker.nodeimages
from engine.docker.config import *
from engine.docker.nodeimages import new_app, cleanup_node

try:
    client = docker.from_env()
except:
    print("ERROR getting docker environtment. Ensure docker is installed and running.")
    exit()


container_src_dir = os.getcwd() + '/server-output/'
nginx_src_dir = os.getcwd() + '/nginx-config/'
editor_src_dir = os.getcwd() + '/editor'
db_src_dir = os.getcwd() + '/postgres-config'


def create_node_image():
    image = client.images.build(
            path=container_src_dir,
            tag=img_tags['node'],
            rm=True)
    return image

def create_nginx_image():
    image = client.images.build(
            path=nginx_src_dir,
            tag=img_tags['nginx'],
            rm=True)
    return image

def create_editor_image():
    image = client.images.build(
            path=editor_src_dir,
            tag=img_tags['editor'],
            rm=True)
    return image

def create_database_image():
    image = client.images.build(
            path=database_source_dir,
            tag=img_tags['database'],
            rm=True
        )
    return image

def create_db_image():
    image = client.images.build(path=db_src_dir, tag="db-img", rm=True)
    return image

def start_nginx():

    ports = {
        '80/tcp': 80
    }


    container = client.containers.run(
        image=img_tags['nginx'],
        detach=True,
        ports=ports,
        network=docker_network_name,
        name=container_names['nginx'],
    )
    print(f"Container '{container.name}' started.")
    return container

def start_postgres():

    ports = {
        '5432/tcp' : 54646
    }

    container = client.containers.run(
        image=img_tags['database'],
        detach=True,
        ports=ports,
        volumes = {
            volume_names['database']: {'bind': '/var/lib/postgresql/data', 'mode': 'rw'}
            },
        environment = postgres_env_vars,
        network=docker_network_name,
        name=container_names['database']
    )
    print(f"Database container '{container.name}' started.")
    return container

def start_editor():
    ports = {
        '5173/tcp' : 5173
    }

    container = client.containers.run(
        image=img_tags['editor'],
        detach=True,
        ports=ports,
        network=docker_network_name,
        name=container_names['editor']
    )
    print(f"Editor container '{container.name}' started.")
    return container


def check_or_create_volume():
    volume = client.api.create_volume(
            name = volume_names['database']
        )
    return volume


def start_network():
    return client.networks.create(name=docker_network_name, driver="bridge")
def stop_network():
    networks = client.networks.list(filters={'name': docker_network_name})
    for network in networks:
        network.remove()

def clear_containers():
    print('clearing containers')
    # remove nginx container
    curr_containers = client.containers.list(all=True, filters={'name': container_names['nginx']})
    for curr_container in curr_containers:
        print(curr_container, "name:", curr_container.name, " exists, deleting...")
        cleanup_node(curr_container)

    try:
        # remove node container
        curr_containers = client.containers.list(all=True, filters={'name': container_names['node']})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, "still exists, deleting...")
            cleanup_node(curr_container)
        
        # remove editor container
        curr_containers = client.containers.list(all=True, filters={'name': container_names['editor']})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, " exists, deleting...")
            cleanup_node(curr_container)
        # remove database container
        curr_containers = client.containers.list(all=True, filters={'name': container_names['database']})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, " exists, deleting...")
            cleanup_node(curr_container)


    except docker.errors.NotFound :
        print("no container exists, none to delete")



def setup():
    clear_containers()
    stop_network()
    network = start_network()
   
    create_database_image()
    create_editor_image()
    create_nginx_image()


    check_or_create_volume()

    pg = start_postgres()
    img = create_node_image()
    ed = start_editor()
    nx = start_nginx()
    db = start_db()








def shutdown():
    clear_containers()
    stop_network()



