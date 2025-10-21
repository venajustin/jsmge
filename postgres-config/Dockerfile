
FROM postgres:14-bookworm

# Files are executed in alphabetic order, prepend with index for ordering
COPY 00_entrypoint.sh /docker-entrypoint-initdb.d/
COPY 01_extensions.sql /docker-entrypoint-initdb.d/
COPY 02_create_tables.sql /docker-entrypoint-initdb.d/
COPY 03_users.sql /docker-entrypoint-initdb.d/
COPY 04_games.sql /docker-entrypoint-initdb.d/



#docker run --name some-postgres -p 5432:5431 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
