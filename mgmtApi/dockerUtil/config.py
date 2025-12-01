import os
from dotenv import load_dotenv

load_dotenv()

container_src_dir = os.getcwd() + '/server-output/'
nginx_src_dir = os.getcwd() + '/nginx-config/'
editor_src_dir = os.getcwd() + '/editor'
database_source_dir = os.getcwd() + '/postgres-config'

img_tags = {
        'node': 'jsmge-server-img',
        'nginx': 'jsmge-nginx-router-img',
        'editor': 'jsmge-react-editor-img',
        'database': 'jsmge-postgres-img'
        }

container_names = {
        'node': 'jsmge-server-output',
        'nginx': 'jsmge-routing-server',
        'editor': 'jsmge-editor',
        'database': 'jsmge-postgres-db'
        }

volume_names = {
        'database': 'jsmge-postgres-volume'
        }

docker_network_name = 'jsmge-user-apps'

postgres_env_vars = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'ADMIN_USER_NAME',
    'ADMIN_USER_PASSWORD',
    'CONNECTION_USER_NAME',
    'CONNECTION_USER_PASSWORD'
    ]
# Just list the env variables you want to be passed into the 
# container above and they will be copied from the .env file config
for i in range(len(postgres_env_vars)):
    env_value = os.getenv(postgres_env_vars[i])
    if env_value is not None:
        postgres_env_vars[i] = postgres_env_vars[i] + "=" + env_value
