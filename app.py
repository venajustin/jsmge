from flask import Flask
import atexit
from dockersetup import setup, clear_containers
app = Flask(__name__)

setup()

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()


def server_shutdown():
    clear_containers()

atexit.register(server_shutdown)