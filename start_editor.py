from engine.docker.dockersetup import *

try:
    network = start_network()
except:
    print("network already exists")
clear_editor()
create_editor_image()
ed = start_editor()

