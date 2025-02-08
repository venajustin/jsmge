from flask import Flask, request
from jinja2 import Environment, FileSystemLoader
import atexit
from dockersetup import setup, clear_containers, refresh_container
app = Flask(__name__)
jenv = Environment(loader = FileSystemLoader('templates'))

example_script = jenv.get_template("example.js").render()

setup()

@app.route('/')
def hello_world():  # put application's code here
    f = open("./applications/test1/test.js")
    script = ""
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

if __name__ == '__main__':
    app.run()


def server_shutdown():
    clear_containers()

atexit.register(server_shutdown)