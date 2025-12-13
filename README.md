# JavaScript Multiplayer Game Engine

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
