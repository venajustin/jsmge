from flask import Flask, request
from jinja2 import Environment, FileSystemLoader
import atexit
import os
import shutil
from flask import jsonify
# from flask_cors import CORS
from engine.docker.dockersetup import setup, shutdown
from engine.docker.nodeimages import new_app, delete_app, get_apps, stop_container, refresh_container, reset_container
from engine.database.connect import get_connection
import time
app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
jenv = Environment(loader = FileSystemLoader('templates'))

example_script = jenv.get_template("example.js").render()

env_fpath = os.getcwd() + '/.env'
if not os.path.exists(env_fpath):
    shutil.copyfile(os.getcwd() + "/.example-env",
                    env_fpath)
    print("EXAMPLE .env FILE WAS WRITTEN TO .env")
    print("YOU MUST CHANGE THE VALUES IN .env BEFORE DEPLOYING IN REAL ENVIRONMENT")
    exit(1)




setup()

# test connection to database
def test_connection():
    print("giving time to wait for db to start")
    time.sleep(3)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM test_tab    
    """)
    print("TESTING DATABASE CONNECTION, contents of test_tab")
    for row in cur:
        print(f"ID: {row[0]}")

test_connection()


selected_machine = 0
# TODO: replace this with session logic, each client has a diff machine selected at start

@app.route('/')
def main_page():  # put application's code here

    return jenv.get_template('main.html').render(jsstart = "work in progress")


@app.route('/save-text', methods= ['POST'])
def save_script():
    newtext = request.form['code-area']
    app.logger.info("pls bro")
    f = open("./applications/test1/test.js", "w")
    f.write(newtext)
    f.close()
    return newtext

@app.route('/reload-application', methods= ['POST'])
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

@app.route('/container/<containerid>/', methods=['POST', 'DELETE'])
def start_stop_container(containerid):
    if request.method == 'POST':
        refresh_container(containerid)
    if request.method == 'DELETE':
        stop_container(containerid)

    return format_container_list()

@app.route('/container/<containerid>/delete-app', methods=['DELETE'])
def remove_app(containerid):

    if request.method == 'DELETE':
        delete_app(containerid)

    return format_container_list()

@app.route('/container/<containerid>/select', methods=['GET'])
def select_container(containerid):
    # TODO: either delete this fn or add the ability to select a container within the manager
    return format_container_list()

@app.route('/container/<containerid>/clean', methods=['POST'])
def clean_container(containerid):
    reset_container(containerid)
    return "success"

@app.route('/container', methods=['POST', 'GET'])
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
    
# @app.route('/api/files', methods=['GET'])
# def get_files():
#         folder_path = './applications/1'
#         files = {}
#         try:
#             for file_name in os.listdir(folder_path):
#                 file_path = os.path.join(folder_path, file_name)
#                 if os.path.isfile(file_path):
#                     with open(file_path, 'r') as file:
#                         files[file_name] = file.read()
#         except Exception as e:
#             return jsonify({"error": str(e)}),500
#         return jsonify(files)



if __name__ == '__main__':
    app.run()


def server_shutdown():
    shutdown()

atexit.register(server_shutdown)