from dockerUtil.dockersetup import *

try:
    network = start_network()
except:
    print("network already exists")
clear_database()
create_database_image()
check_or_create_volume()
pg = start_postgres()
