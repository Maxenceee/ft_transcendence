FROM postgres:16

ENV POSTGRES_PASSWORD "dockermdp"

COPY init.sql /docker-entrypoint-initdb.d/

COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]