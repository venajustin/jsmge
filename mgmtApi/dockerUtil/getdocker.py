def getdocker():
    try:
        return docker.from_env()
    except:
        print("ERROR getting docker environment. Ensure docker is installed and running.")
        exit()
