from flask import Flask, request
from jinja2 import Environment, FileSystemLoader
import atexit
import os
import shutil
from flask import jsonify
import jwt
from functools import wraps
# from flask_cors import CORS
from engine.docker.dockersetup import setup, shutdown
from engine.docker.nodeimages import (
    new_app,
    delete_app,
    get_apps,
    stop_container,
    refresh_container,
    reset_container,
)
from engine.database.connect import get_connection
from engine.util import check_and_create_env
import time
import bcrypt
import datetime

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
jenv = Environment(loader=FileSystemLoader("templates"))

example_script = jenv.get_template("example.js").render()

check_and_create_env()


setup()
# breakpoint()
SECRET_KEY = "secret_key"

#verification of token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            token = token.split(" ")[1] if " " in token else token
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = payload["username"]  # Attach user info to the request
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated
# test connection to database
def test_connection():
    print("giving time to wait for db to start")
    time.sleep(3)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT * FROM test_tab    
    """
    )
    print("TESTING DATABASE CONNECTION, contents of test_tab")
    for row in cur:
        print(f"ID: {row[0]}")


test_connection()


selected_machine = 0
# TODO: replace this with session logic, each client has a diff machine selected at start


@app.route("/")
def main_page():  # put application's code here

    return jenv.get_template("main.html").render(jsstart="work in progress")


@app.route("/save-text", methods=["POST"])
def save_script():
    newtext = request.form["code-area"]
    app.logger.info("pls bro")
    f = open("./applications/test1/test.js", "w")
    f.write(newtext)
    f.close()
    return newtext


@app.route("/reload-application", methods=["POST"])
def reload_app():
    if refresh_container(selected_machine):
        return ""
    else:
        return jenv.get_template("error.html").render(errmsg="ERROR OCCURED ON BACKEND")


def format_container_list():
    machines = get_apps()

    output = ""
    for machine in machines:
        output += jenv.get_template("server-list-item.html").render(
            servername=machine["name"],
            status=machine["status"],
            link="/app/" + str(machine["id"]),
            buttonstyle="",
            containerid=machine["id"],
        )
    return output


@app.route("/container/<containerid>/", methods=["POST", "DELETE"])
def start_stop_container(containerid):
    if request.method == "POST":
        refresh_container(containerid)
    if request.method == "DELETE":
        stop_container(containerid)

    return format_container_list()


@app.route("/container/<containerid>/delete-app", methods=["DELETE"])
def remove_app(containerid):

    if request.method == "DELETE":
        delete_app(containerid)

    return format_container_list()


@app.route("/container/<containerid>/select", methods=["GET"])
def select_container(containerid):
    # TODO: either delete this fn or add the ability to select a container within the manager
    return format_container_list()


@app.route("/container/<containerid>/clean", methods=["POST"])
def clean_container(containerid):
    reset_container(containerid)
    return "success"


@app.route("/container", methods=["POST", "GET"])
def container_interactions():
    if request.method == "POST":
        machine = new_app()

        return jenv.get_template("server-list-item.html").render(
            servername=machine["name"],
            status=machine["status"],
            link="/app/" + str(machine["id"]),
            buttonstyle="background-color:green;",
            containerid=machine["id"],
        )
    elif request.method == "GET":
        # for now with no user auth any user can access all machines

        return format_container_list()

    else:
        return "err"


# take this out put in editor/react app
@app.route("/register")
def register_page():
    return jenv.get_template("register.html").render(jsstart="work in progress")


@app.route("/register", methods=["POST"])
def test_register():
    print("Testing a user registering an account")
    try:
        conn = get_connection()
        cur = conn.cursor()
        user = request.form.get("username")
        passWord = request.form.get("password")
        email = request.form.get("email")

        cur.execute(
            """
            insert into users (username, email, password_hash) values (%s, %s, crypt(%s, gen_salt('bf')))  
        """,
            (user, email, passWord),
        )

        conn.commit()

        cur.execute(
            """
            SELECT * FROM users    
        """
        )
        for row in cur:
            print(f"{row}")
        return jsonify({"message": "User was created"})
    except Exception as e:
        return jsonify({"message": str(e)})


# take this out put in editor/react app
@app.route("/login")
def login_page():
    return jenv.get_template("login.html").render(jsstart="work in progress")

@app.route("/protector")
def prot():
    return jenv.get_template("protected.html").render(jssstart='work in progress')


@app.route("/login", methods=["POST"])
def login():
    user = request.form.get("username")
    password = request.form.get("password")

    if not user or not password:
        return jsonify({"message": "username and password are required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
        SELECT password_hash FROM users where username = %s  
    """,
            (user,),
        )

        row = cur.fetchone()

        if row is None:
            return jsonify({"message": "User was not found with associated username"})
        else:
            hashpw = row[0]

            if bcrypt.checkpw(password.encode("utf-8"), hashpw.encode("utf-8")):
                # need to include either flask session here or JWT Acess token
                expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                payload = {
                    "username":user,
                    "exp": expire
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                
                return jsonify({"message": "Login successful", "token": token})

            else:
                return jsonify({"message": "Incorrect password"})
    except Exception as e:
        return jsonify({"message": str(e)})

@app.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({"message": f"Hello , {request.user}! This is a protected route."})
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


if __name__ == "__main__":
    app.run()


def server_shutdown():
    shutdown()


# atexit.register(server_shutdown)
