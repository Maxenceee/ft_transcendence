FROM python:3.9-slim

RUN apt-get update -y && apt-get upgrade -y

RUN pip install --upgrade pip

RUN pip install django==4.0.0 channels==3.0.4 psycopg2-binary python-dotenv passlib

RUN mkdir /app

EXPOSE 8000

WORKDIR /app/server

COPY ./startup.sh ./

RUN chmod +x ./startup.sh

COPY ./client /app/client

COPY ./server/ /app/server

RUN python3 manage.py makemigrations

CMD ["./startup.sh"]
