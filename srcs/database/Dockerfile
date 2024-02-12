FROM postgres:16

ENV POSTGRES_PASSWORD ${POSTGRES_ROOTPASSWORD}

COPY init.sql /docker-entrypoint-initdb.d/

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

RUN sed /docker-entrypoint-initdb.d/init.sql -i -e 's/ENV_USERNAME/${POSTGRES_USER}/'
RUN sed /docker-entrypoint-initdb.d/init.sql -i -e 's/ENV_POSTGRES_PASSWORD/${POSTGRES_PASSWORD}/'
RUN sed /docker-entrypoint-initdb.d/init.sql -i -e 's/ENV_POSTGRES_DB/${POSTGRES_DB}/'

COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]