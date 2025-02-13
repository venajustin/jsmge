import os

import docker
import docker.errors

client = docker.from_env()

host_server_js = os.getcwd() + '/applications/test1'
container_server_js = '/usrcode/'
container_src_dir = os.getcwd() + '/server-output/'
nginx_src_dir = os.getcwd() + '/nginx-config/'

def clear_containers():
    print('clearing containers')
    curr_containers = client.containers.list(all=True, filters={'name': 'routing-server'})
    for curr_container in curr_containers:
        print(curr_container, "name:", curr_container.name, " exists, deleting...")
        cleanup_deno(curr_container)

    try:
        curr_containers = client.containers.list(all=True, filters={'name': 'server-output'})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, "still exists, deleting...")
            cleanup_deno(curr_container)
    except docker.errors.NotFound :
        print("no container exists, none to delete")

def create_image():
    image = client.images.build(path=container_src_dir, tag="ecmaplayer-img", rm=True)
    return image

def create_nginx_image():
    image = client.images.build(path=nginx_src_dir, tag="nginx-router-img", rm=True)
    return image


def start_node(number = 1):
    # defines the mounting of server backend code
    volumes = {
        host_server_js: {'bind':container_server_js, 'mode': 'ro'}
    }

    name = 'server-output' + str(number)

    # ports = {
    #     '3000/tcp': 8080
    # }

    container = client.containers.run(
        image='ecmaplayer-img:latest',
        detach=True,
        volumes=volumes,
        # ports=ports,
        name = name,
        # name='server-output',
        network='user-apps'
    )
    print(f"Container '{container.name}' started with volume mount.")
    return container

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

def cleanup_deno(container):
    print("cleanup container", container.name)
    try:
        container.kill()
        print("container stopped, removing...")
    except docker.errors.APIError:
        print("container already stopped, removing...")
    finally:
        container.remove()
        print("container removed")

def refresh_container():
    container = client.containers.get("server-output")
    try:
        container.restart()
        return True
    except:
        return False

def start_network():
    return client.networks.create(name="user-apps", driver="bridge")
def stop_network():
    networks = client.networks.list(filters={'name': 'user-apps'})
    for network in networks:
        network.remove()




def setup():
    clear_containers()
    stop_network()
    network = start_network()
    create_nginx_image()
    img = create_image()
    cont = start_node()
    nx = start_nginx()


def shutdown():
    clear_containers()
    stop_network()



