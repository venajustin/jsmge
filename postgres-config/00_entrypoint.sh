#!/bin/bash

# ---------------------------------------------------------------------
# 
#  Input validation for environment variables
#   From @beld_pro on Medium.com
#
# ---------------------------------------------------------------------

# Immediately exits if any error occurs during the script
# execution. If not set, an error could occur and the
# script would continue its execution.
set -o errexit


# Creating an array that defines the environment variables
# that must be set. This can be consumed later via arrray
# variable expansion ${REQUIRED_ENV_VARS[@]}.
readonly REQUIRED_ENV_VARS=(
  "POSTGRES_USER"
  "ADMIN_USER_NAME"
  "ADMIN_USER_PASSWORD"
  "CONNECTION_USER_NAME"
  "CONNECTION_USER_PASSWORD")


# Main execution:
# - verifies if all environment variables are set
# - runs the SQL code to create user and database
main() {
  check_env_vars_set
  init_user_and_db
}


# Checks if all of the required environment
# variables are set. If one of them isn't,
# echoes a text explaining which one isn't
# and the name of the ones that need to be
check_env_vars_set() {
  for required_env_var in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!required_env_var}" ]]; then
      echo "Error:
    Environment variable '$required_env_var' not set.
    Make sure you have the following environment variables set:
      ${REQUIRED_ENV_VARS[@]}
Aborting."
      exit 1
    fi
  done
}



# ---------------------------------------------------------------------
# 
#  Creating users
#
# ---------------------------------------------------------------------

# Performs the initialization in the already-started PostgreSQL
# using the preconfigured POSTGRE_USER user.
init_user_and_db() {
  echo "pg user: ${POSTGRES_USER}"
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" <<-EOSQL
    CREATE USER $ADMIN_USER_NAME WITH PASSWORD '$ADMIN_USER_PASSWORD';
    CREATE DATABASE jsmge OWNER $ADMIN_USER_NAME;
    \c jsmge;
    GRANT ALL PRIVILEGES ON DATABASE jsmge TO $ADMIN_USER_NAME;
    GRANT ALL ON SCHEMA public TO $ADMIN_USER_NAME;
    ALTER DEFAULT PRIVILEGES FOR ROLE $ADMIN_USER_NAME IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $ADMIN_USER_NAME;
    ALTER DEFAULT PRIVILEGES FOR ROLE $ADMIN_USER_NAME IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $ADMIN_USER_NAME;
EOSQL
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" <<-EOSQL
    CREATE USER $CONNECTION_USER_NAME WITH PASSWORD '$CONNECTION_USER_PASSWORD';
    \c jsmge;
    GRANT CONNECT ON DATABASE jsmge TO $CONNECTION_USER_NAME;
EOSQL
}


# Executes the main routine with environment variables
# passed through the command line.
main "$@"

