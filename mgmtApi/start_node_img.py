from dockerUtil.dockersetup import *

try:
    network = start_network()
except:
    print("network already exists")
clear_node()
create_node_image()

