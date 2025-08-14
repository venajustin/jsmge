import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    dbname = "jsmge"
    user = os.getenv('ADMIN_USER_NAME')
    password = os.getenv('ADMIN_USER_PASSWORD')
    host = "localhost"
    port = "54646"
    connection_string = f"host='{host}' port='{port}' dbname='{dbname}' user='{user}' password='{password}'"
    conn = psycopg2.connect(connection_string)
    return conn
