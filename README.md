# JavaScript Multiplayer Game Engine

Project Code:
https://github.com/venajustin/jsmge

## Project Structure

### Components / Top-level directories

Each of the following folders is set up with a Dockerfile that defines the container image that will be built. `compose.yaml` defines settings so that the docker compose script can be used to build and deploy containers. The server-output image is not included in this script and must be built seperately, using a python script.

- editor
    - React application using the Vue framework
    - Allows users to create and edit games in an interactive code editor, file management environment with a preview
- nginx-config
    - nginx routing server for directing requests to docker containers
    - Folder contains nginx configuration file
- postgres-config
    - PostgreSQL relational database
    - Folder contains configuration and startup sql scripts to populate the database on a new host computer.
- server-output
    - The engine server backend that hosts user games.
    - This is built as a node container and is instantiated at runtime for each user game.
    - This server acts both as the backend for the development environment, and as a host when playing games.
- mgmtApi
    - Flask web server that handles requests related to game management.
    - This container has the ability to instantiate containers from the server-output image.



## Local Deployment

### Prerequisites

Install the following before proceeding
- [Python 3+](https://www.python.org/downloads/)
- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)

### Clone this repo
```bash
git clone https://github.com/venajustin/jsmge.git
```
or, if using ssh auth:
```bash
git clone git@github.com:venajustin/jsmge
```

### Setup virtual environment

Windows
- `py -m venv .venv`
- `.venv\Scripts\activate` <-- Required each time you use a new terminal session

Mac / Linux
- `python3 -m venv .venv` 
- `source .venv/bin/activate` <-- Required each time you use a new terminal session


### Install libraries 

For running the python api in development, on all platforms, after activating environment:
```bash
pip install -r ./requirements.txt
```


### Compilation

Ensure that the docker daemon is running before running the following

Creating server-output docker image
```bash
cd mgmtApi
python start_node_img.py
```

Building Docker images for other server components
```bash
docker compose build
```

### Run Server 

```bash
docker compose up -d
```

### Stopping Server

- Stop all games in user games manager
- or stop containers manually with docker
- Run the following to bring down other components
```bash
docker compose down
```
