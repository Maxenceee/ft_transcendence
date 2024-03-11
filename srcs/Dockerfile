FROM python:3.9-slim

RUN apt-get update -y && apt-get upgrade -y

RUN pip install --upgrade pip

RUN pip install django==4.0.0 channels==3.0.4 psycopg2-binary python-dotenv passlib requests

RUN apt-get install -y curl wget

RUN mkdir /app

COPY ./client /app/client

COPY ./server/ /app/server

WORKDIR /app/server

RUN python3 manage.py makemigrations

RUN python3 manage.py makemigrations index

RUN python3 manage.py makemigrations game

EXPOSE 3000

CMD ["sh", "./startup.sh"]
