FROM python:3.7-slim

RUN apt-get update -y && apt-get upgrade -y

RUN pip install --upgrade pip

RUN pip install Django psycopg2-binary

RUN mkdir /app

COPY ./server/src /app/server

WORKDIR /app/server

COPY ./client /app/client

EXPOSE 8000

RUN python3 manage.py makemigrations

COPY ./startup.sh ./

RUN chmod +x ./startup.sh

CMD ["./startup.sh"]
