from flask import Flask, request, make_response
from jinja2 import Environment, FileSystemLoader
import atexit
import os
import shutil
from flask import jsonify
import jwt
from functools import wraps
from flask_cors import CORS
from dockerUtil.dockersetup import setup, shutdown, create_node_image
from dockerUtil.nodeimages import (
    new_app,
    delete_app,
    get_apps,
    stop_container,
    refresh_container,
    reset_container,
    get_running_apps
)
from database.connect import get_connection
from util import check_and_create_env
import time
import bcrypt
import datetime

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})
CORS(app, 
     resources={r"/*": {"origins": ["localhost", "http://localhost", "http://127.0.0.1", "http://localhost:5174"]}},
     supports_credentials=True 
     ) # might get deleted when public
jenv = Environment(loader=FileSystemLoader("templates"))

example_script = jenv.get_template("example.js").render()

# check_and_create_env() TODO: put this back in wherever we setup the env stuff


#img = create_node_image()
# setup()
# breakpoint()
SECRET_KEY = "secret_key"


# verification of token
# uses a decorator so that we can just call @token_requried and use request.uid to get users uid in a app route
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            conn = get_connection()
            cur = conn.cursor()
            token = token.split(" ")[1] if " " in token else token
            cur.execute("SELECT uid, expire FROM Sessions WHERE token = %s", (token,))
            session_row = cur.fetchone()
            if session_row is None:
                return jsonify({"message": "Session not found or expired"}), 401
            uid, expire = session_row
            if expire < datetime.datetime.utcnow():
                return jsonify({"message": "Session expired"}), 401

            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if (len(payload["uid"]) > 0):
                request.uid = payload["uid"][0]
            else:
                return jsonify({"message": "User not logged in"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            print("Error ", str(e))
            return jsonify({"message": "User not logged in"}), 401
        return f(*args, **kwargs)

    return decorated


# test connection to database
def test_connection():
    print("giving time to wait for db to start")
    #time.sleep(3)
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



@app.route("/register", methods=["POST"])
def test_register():
    print("Testing a user registering an account")
    try:
        conn = get_connection()
        cur = conn.cursor()
        # user = request.form.get("username")
        passWord = request.form.get("password")
        email = request.form.get("email")

        cur.execute(
            """
            insert into users (email, password) values ( %s, crypt(%s, gen_salt('bf')))  
        """,
            (email, passWord),
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
        print("Error: Error creating user - ", str(e))
        return jsonify({"message": "Error creating user"}), 400
        # return jsonify({"message": str(e)}) <- unsafe




@app.route("/protector")
def prot():
    return jenv.get_template("protected.html").render(jssstart="work in progress")


@app.route("/login", methods=["POST"])
def login():
    
    email = request.form.get("email")
    password = request.form.get("password")
    #print(email, password)

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
        SELECT uid FROM users WHERE email = %s AND password = crypt(%s, password)
    """,
            (email,password),
        )

        row = cur.fetchone()

        if row is None:
            return jsonify({"message": "Incorrect username or password"})
        else:

            uid = row

            expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            payload = {"uid": uid, "exp": expire}
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

            # set token in db
            cur.execute(
                """
                INSERT INTO Sessions (uid, token, expire)
                VALUES (%s,%s,%s)
                """,
                (uid, token, expire),
            )
            conn.commit()

            resp = make_response(jsonify({"message": "Login successful", "token": token}))
            resp.set_cookie(
                    "jsmge_account_token", 
                    value=token,
                    httponly=True,
                    samesite="None",
                    secure=True
                    )
            return resp
    except Exception as e:
        print("Error: ", str(e))
        return jsonify({"message": "Incorrect username or password"}), 400


@app.route("/protected", methods=["GET"])
@token_required
def protected():
    return jsonify({"message": f"Hello! This is a protected route."})


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


@app.route("/newGame", methods=["POST"])
@token_required
def insertNewGame():
    gameTitle = request.form.get("gameTitle")
    gameDesc = request.form.get("gameDescription")
    #print(gameTitle, gameDesc)

    if not gameTitle or not gameDesc:
        return jsonify({"message": "title and description are required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
                    INSERT INTO Games ( title, description)
                    VALUES (%s,%s)
                    RETURNING id
                    """,
            ( gameTitle, gameDesc),
        )

        # cur.execute(
        #             """
        #             SELECT id FROM Games where title = %s and description = %s
                
        #             """,
        #             (gameTitle, gameDesc),
        # )

        row = cur.fetchone()
        if row is None:
            return jsonify({"message": "Game not found after insert"}), 500
        game_id = row[0]

    
        print( "setting game ", game_id, " owner to ", request.uid)
        cur.execute(
            """
                    INSERT INTO Owns (uid, gameID)
                    VALUES (%s,%s)
                
                    """,
            ( request.uid, game_id),
        )
        
        conn.commit()

        folderName = str(game_id)
        headFolder = "applications"
        try:
            path = os.path.join(headFolder, folderName)
            print(path)
            source = "usrcode"
            #os.makedirs(path)
            shutil.copytree(source, path)
        except Exception as e:
            print("Error ", str(e))
            print("An error occured making game folder")
        return "", 201

    except Exception as e:
        print("Error ", str(e))
        return jsonify({"message": "Error creating game"})

#work on this tmmrw
@app.route("/getGames", methods=["GET"])
@token_required
def getGames():
    try:
        conn = get_connection()
        cur = conn.cursor()


        cur.execute(
                    """
                    SELECT gameid FROM owns where uid = %s
                
                    """,
                    (request.uid,)
        )

        row = cur.fetchall()
        #print(row)
        if row is None:
            return jsonify({"message": "Games not found"}), 500
        games = []
        for(game_id,) in row:
            cur.execute(
                "SELECT title, description, id FROM games where id = %s",
                (game_id,)
            )
            data = cur.fetchone()
            if data:
                games.append({
                    "id": data[2],
                    "title": data[0],
                    "description": data[1]
                })

        activeGames = []
        for container in get_running_apps():
            cid = container.name
            dashpos = cid.rfind('-')
            if dashpos == -1:
                continue
            cid = cid[dashpos+1:]
            print("CID ", cid)
            for game in games:
                if game['id'] == int(cid):
                    activeGames.append(game['id'])

        print("GAMES: ", games)
        print("ACTIVE GAMES: ", activeGames)
        return jsonify({"games": games, "active_games": activeGames}),200

    except Exception as e:
        return jsonify({"message": str(e)})
    
if __name__ == "__main__":
    app.run()


def server_shutdown():
    shutdown()


# atexit.register(server_shutdown)
