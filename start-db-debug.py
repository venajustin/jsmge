# from flask_cors import CORS
from engine.docker.dockersetup import \
    clear_containers, stop_network,\
    start_postgres, start_network, \
    check_or_create_volume, create_database_image
from engine.util import check_and_create_env
import atexit


if __name__ == '__main__':
    check_and_create_env()
    start_network()
    check_or_create_volume()
    create_database_image()
    start_postgres()

    def stop_all():
        clear_containers()
        stop_network()
    atexit.register(stop_all)

    while input("press enter to stop"):
        exit()
