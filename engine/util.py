import os
import shutil

def check_and_create_env():
    env_fpath = os.getcwd() + '/.env'
    if not os.path.exists(env_fpath):
        shutil.copyfile(os.getcwd() + "/.example-env",
                        env_fpath)
        print("EXAMPLE .env FILE WAS WRITTEN TO .env")
        print("YOU MUST CHANGE THE VALUES IN .env BEFORE DEPLOYING IN REAL ENVIRONMENT")
        exit(1)