from flask import Flask, request
from jinja2 import Environment, FileSystemLoader
import atexit
from engine.docker.dockersetup import setup, shutdown, refresh_container
app = Flask(__name__)
jenv = Environment(loader = FileSystemLoader('templates'))

example_script = jenv.get_template("example.js").render()

setup()

@app.route('/')
def hello_world():  # put application's code here
    f = open("./applications/test1/test.js")
    if f.readable():
        script = f.read()
    else:
        script = example_script
    return jenv.get_template('main.html').render(jsstart = script)


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
    if refresh_container():
        return ""
    else:
        return jenv.get_template('error.html').render(errmsg = "ERROR OCCURED ON BACKEND")

@app.route('/api/container/<containerid>/select', methods=['GET'])
def select_container(containerid):
    pass
        # select(containerid) # todo: user auth and select for user

@app.route('/api/container', methods=['POST', 'GET'])
def container_interactions():
    if request.method == 'POST':
        # TODO: create a new machine
        return jenv.get_template("server-list-item.html").render(
            servername="example-server-1",
            status="online",
            link="/app/1",
            buttonstyle="background-color:green;",
            containerid="999888999"
        )
    elif request.method =='GET':
        # TODO: fetch from list of running machines
        # TODO: obviously secure this to only be owned machines by that user

        example_machines = [
            {
                'name': "example-server-2",
                'status': "offline",
                'id': "88877776666",
                'index': "2"
            },
            {
                'name': "example-server-3",
                'status': "offline",
                'id': "1686516156",
                'index': "3"
            },
            {
                'name': "example-server-4",
                'status': "offline",
                'id': "46464646",
                'index': "4"
            }
        ]

        output = ""
        for example_machine in example_machines:
            output += jenv.get_template("server-list-item.html").render(
            servername=example_machine['name'],
            status=example_machine['status'],
            link="/app/" + example_machine['index'],
            buttonstyle="",
            containerid=example_machine['id']
        )
        return output

    else:
        return "err"

if __name__ == '__main__':
    app.run()


def server_shutdown():
    shutdown()

atexit.register(server_shutdown)