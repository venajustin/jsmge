FROM postgres:14-bookworm


COPY init.sql /docker-entrypoint-initdb.d/
COPY entrypoint.sh /docker-entrypoint-initdb.d/
# NOTE: init.sql is always executed before entrypoint.sh

