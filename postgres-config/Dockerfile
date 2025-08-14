FROM postgres:14-bookworm

# Files are executed in alphabetic order, prepend with index for ordering
COPY 00_entrypoint.sh /docker-entrypoint-initdb.d/
COPY 01_create_tables.sql /docker-entrypoint-initdb.d/


