from flask import Flask, request
from jinja2 import Environment, FileSystemLoader
import atexit
from engine.docker.dockersetup import setup, shutdown
from engine.docker.nodeimages import new_app, delete_app, get_apps, stop_container, refresh_container, reset_container

app = Flask(__name__)
jenv = Environment(loader = FileSystemLoader('templates'))

example_script = jenv.get_template("example.js").render()


setup()


selected_machine = 0
# TODO: replace this with session logic, each client has a diff machine selected at start

@app.route('/')
def main_page():  # put application's code here

    return jenv.get_template('main.html').render(jsstart = "work in progress")


@app.route('/api/save-text', methods= ['POST'])
def save_script():
    newtext = request.form['code-area']
    app.logger.info("pls bro")
    f = open("./applications/test1/test.js", "w")
    f.write(newtext)
    f.close()
    return newtext



@app.route('/api/reload-application', methods= ['POST'])
def reload_app():
    if refresh_container(selected_machine):
        return ""
    else:
        return jenv.get_template('error.html').render(errmsg = "ERROR OCCURED ON BACKEND")


def format_container_list():
    machines = get_apps()

    output = ""
    for machine in machines:
        output += jenv.get_template("server-list-item.html").render(
            servername=machine['name'],
            status=machine['status'],
            link="/app/" + str(machine['id']),
            buttonstyle="",
            containerid=machine['id']
        )
    return output

@app.route('/api/container/<containerid>/', methods=['POST', 'DELETE'])
def start_stop_container(containerid):
    if request.method == 'POST':
        refresh_container(containerid)
    if request.method == 'DELETE':
        stop_container(containerid)

    return format_container_list()

@app.route('/api/container/<containerid>/delete-app', methods=['DELETE'])
def remove_app(containerid):

    if request.method == 'DELETE':
        delete_app(containerid)

    return format_container_list()

@app.route('/api/container/<containerid>/select', methods=['GET'])
def select_container(containerid):
    # TODO: either delete this fn or add the ability to select a container within the manager
    return format_container_list()

@app.route('/api/container/<containerid>/clean', methods=['POST'])
def clean_container(containerid):
    reset_container(containerid)
    return "success"

@app.route('/api/container', methods=['POST', 'GET'])
def container_interactions():
    if request.method == 'POST':
        machine = new_app()

        return jenv.get_template("server-list-item.html").render(
            servername=machine['name'],
            status=machine['status'],
            link="/app/" + str(machine['id']),
            buttonstyle="background-color:green;",
            containerid=machine['id']
        )
    elif request.method =='GET':
        # for now with no user auth any user can access all machines

        return format_container_list()

    else:
        return "err"

if __name__ == '__main__':
    app.run()


def server_shutdown():
    shutdown()

atexit.register(server_shutdown)