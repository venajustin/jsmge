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

On all platforms, after activating environment:
```bash
pip install -r ./requirements.txt
```

### Run Server

Ensure that the docker daemon is running before running the server.

```bash
flask run
```

The first time you may experience delays as docker is installing the required base images. 
Future compilation will not incur these delays.
