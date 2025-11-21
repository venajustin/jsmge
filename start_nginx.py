from engine.docker.dockersetup import *

try:
    network = start_network()
except:
    print("network already exists")
clear_nginx()
create_nginx_image()
nx = start_nginx()


