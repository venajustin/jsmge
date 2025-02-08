import os

import docker
import docker.errors

client = docker.from_env()

host_server_js = os.getcwd() + '/applications/test1'
container_server_js = '/usrcode/'
container_src_dir = os.getcwd() + '/ecmaplayer-output/'

def clear_containers():

    try:
        curr_containers = client.containers.list(all=True, filters={'name': 'ecmaplayer-output'})

        for curr_container in curr_containers:
            print(curr_container, "name:", curr_container.name, "still exists, deleting...")
            cleanup_deno(curr_container)
    except docker.errors.NotFound :
        print("no container exists, none to delete")

def create_image():
    image = client.images.build(path=container_src_dir, tag="ecmaplayer-img", rm=True)
    return image

def start_deno():
    # defines the mounting of server backend code
    volumes = {
        host_server_js: {'bind':container_server_js, 'mode': 'rw'}
    }

    ports = {
        '3000/tcp': 8080
    }



    container = client.containers.run(
        image='ecmaplayer-img:latest',
        detach=True,
        volumes=volumes,
        ports=ports,
        name='ecmaplayer-output'
    )
    print(f"Container '{container.name}' started with volume mount.")
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
    container = client.containers.get("ecmaplayer-output")
    try:
        container.restart()
        return True
    except:
        return False

def setup():
    clear_containers()
    img = create_image()
    cont = start_deno()





